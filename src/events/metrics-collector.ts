import {
  VerificationEventEmitter,
  EventListener,
} from './event-emitter';
import {
  VerificationEventType,
  VerificationEventData,
  PerformanceEventData,
  ServiceType,
  VerificationStatus,
  MetricsEventData,
} from '../types/event-types';

export interface ServiceMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  pendingRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  errorRate: number;
  lastRequest?: Date;
  lastSuccess?: Date;
  lastFailure?: Date;
}

export interface AdapterMetrics {
  [serviceType: string]: ServiceMetrics;
  overall: ServiceMetrics;
}

export interface MetricsSnapshot {
  timestamp: Date;
  adapters: Record<string, AdapterMetrics>;
  global: {
    totalRequests: number;
    totalSuccesses: number;
    totalFailures: number;
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
  };
}

/**
 * Metrics Collector - Collects and aggregates verification metrics
 */
export class MetricsCollector {
  private readonly emitter: VerificationEventEmitter;
  private readonly metrics: Map<string, AdapterMetrics> = new Map();
  private readonly responseTimes: Map<string, number[]> = new Map();
  private readonly startTime: Date = new Date();
  private readonly subscriptions: Array<{ unsubscribe: () => void }> = [];
  private metricsInterval?: NodeJS.Timeout;

  constructor(
    emitter: VerificationEventEmitter,
    options: {
      emitInterval?: number; // Emit metrics every N milliseconds
      maxResponseTimeSamples?: number; // Keep last N response times for averaging
    } = {},
  ) {
    this.emitter = emitter;

    this.setupListeners();

    if (options.emitInterval) {
      this.startMetricsEmission(options.emitInterval);
    }
  }

  /**
   * Setup event listeners
   */
  private setupListeners(): void {
    // Listen to verification events
    const verificationSub = this.emitter.on(
      '*' as any,
      this.handleVerificationEvent.bind(this),
    );
    this.subscriptions.push(verificationSub);
  }

  /**
   * Handle verification events
   */
  private handleVerificationEvent(
    eventType: VerificationEventType,
    data: VerificationEventData | PerformanceEventData,
  ): void {
    if (!('adapter' in data)) {
      return;
    }

    const adapter = data.adapter;

    // Initialize metrics for adapter if not exists
    if (!this.metrics.has(adapter)) {
      this.metrics.set(adapter, this.createAdapterMetrics());
    }

    const adapterMetrics = this.metrics.get(adapter)!;

    // Handle verification events
    if (eventType.includes('verification') && 'status' in data) {
      const verificationData = data as VerificationEventData;
      const serviceType = verificationData.serviceType;

      this.updateMetrics(
        adapterMetrics,
        serviceType,
        verificationData.status,
        verificationData.duration,
      );
    }

    // Handle performance events
    if (eventType === VerificationEventType.RESPONSE_RECEIVED && 'duration' in data) {
      const perfData = data as PerformanceEventData;
      if (perfData.serviceType) {
        this.recordResponseTime(adapter, perfData.serviceType, perfData.duration);
      }
    }
  }

  /**
   * Update metrics for a service
   */
  private updateMetrics(
    adapterMetrics: AdapterMetrics,
    serviceType: ServiceType,
    status: VerificationStatus,
    duration?: number,
  ): void {
    // Ensure service metrics exist
    if (!adapterMetrics[serviceType]) {
      adapterMetrics[serviceType] = this.createServiceMetrics();
    }

    const serviceMetrics = adapterMetrics[serviceType];
    const overallMetrics = adapterMetrics.overall;

    // Update counts
    serviceMetrics.totalRequests++;
    overallMetrics.totalRequests++;

    if (status === VerificationStatus.SUCCESS) {
      serviceMetrics.successfulRequests++;
      overallMetrics.successfulRequests++;
      serviceMetrics.lastSuccess = new Date();
      overallMetrics.lastSuccess = new Date();
    } else if (
      status === VerificationStatus.FAILED ||
      status === VerificationStatus.TIMEOUT ||
      status === VerificationStatus.INVALID_DATA
    ) {
      serviceMetrics.failedRequests++;
      overallMetrics.failedRequests++;
      serviceMetrics.lastFailure = new Date();
      overallMetrics.lastFailure = new Date();
    } else if (status === VerificationStatus.PENDING || status === VerificationStatus.PROCESSING) {
      serviceMetrics.pendingRequests++;
      overallMetrics.pendingRequests++;
    }

    // Update error rate
    serviceMetrics.errorRate =
      serviceMetrics.totalRequests > 0
        ? serviceMetrics.failedRequests / serviceMetrics.totalRequests
        : 0;
    overallMetrics.errorRate =
      overallMetrics.totalRequests > 0
        ? overallMetrics.failedRequests / overallMetrics.totalRequests
        : 0;

    // Update response time if available
    if (duration !== undefined) {
      this.updateResponseTime(serviceMetrics, duration);
      this.updateResponseTime(overallMetrics, duration);
    }

    serviceMetrics.lastRequest = new Date();
    overallMetrics.lastRequest = new Date();
  }

  /**
   * Record response time
   */
  private recordResponseTime(adapter: string, serviceType: ServiceType, duration: number): void {
    const key = `${adapter}:${serviceType}`;

    if (!this.responseTimes.has(key)) {
      this.responseTimes.set(key, []);
    }

    const times = this.responseTimes.get(key)!;
    times.push(duration);

    // Keep only last 100 samples
    if (times.length > 100) {
      times.shift();
    }
  }

  /**
   * Update response time metrics
   */
  private updateResponseTime(metrics: ServiceMetrics, duration: number): void {
    if (metrics.minResponseTime === 0 || duration < metrics.minResponseTime) {
      metrics.minResponseTime = duration;
    }

    if (duration > metrics.maxResponseTime) {
      metrics.maxResponseTime = duration;
    }

    // Recalculate average
    const total = metrics.averageResponseTime * (metrics.totalRequests - 1) + duration;
    metrics.averageResponseTime = total / metrics.totalRequests;
  }

  /**
   * Get metrics for a specific adapter
   */
  getAdapterMetrics(adapter: string): AdapterMetrics | undefined {
    return this.metrics.get(adapter);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Record<string, AdapterMetrics> {
    const result: Record<string, AdapterMetrics> = {};
    this.metrics.forEach((metrics, adapter) => {
      result[adapter] = metrics;
    });
    return result;
  }

  /**
   * Get metrics snapshot
   */
  getSnapshot(): MetricsSnapshot {
    const adapters = this.getAllMetrics();
    const global = this.calculateGlobalMetrics(adapters);

    return {
      timestamp: new Date(),
      adapters,
      global,
    };
  }

  /**
   * Calculate global metrics
   */
  private calculateGlobalMetrics(adapters: Record<string, AdapterMetrics>) {
    let totalRequests = 0;
    let totalSuccesses = 0;
    let totalFailures = 0;
    let totalResponseTime = 0;
    let responseTimeCount = 0;

    Object.values(adapters).forEach((adapterMetrics) => {
      const overall = adapterMetrics.overall;
      totalRequests += overall.totalRequests;
      totalSuccesses += overall.successfulRequests;
      totalFailures += overall.failedRequests;

      if (overall.totalRequests > 0) {
        totalResponseTime += overall.averageResponseTime * overall.totalRequests;
        responseTimeCount += overall.totalRequests;
      }
    });

    return {
      totalRequests,
      totalSuccesses,
      totalFailures,
      averageResponseTime: responseTimeCount > 0 ? totalResponseTime / responseTimeCount : 0,
      errorRate: totalRequests > 0 ? totalFailures / totalRequests : 0,
      uptime: Date.now() - this.startTime.getTime(),
    };
  }

  /**
   * Start emitting metrics at regular intervals
   */
  private startMetricsEmission(interval: number): void {
    this.metricsInterval = setInterval(() => {
      const snapshot = this.getSnapshot();

      Object.entries(snapshot.adapters).forEach(([adapter, metrics]) => {
        this.emitter.emit<MetricsEventData>(VerificationEventType.METRICS_COLLECTED, {
          adapter,
          metrics: metrics.overall,
          period: {
            start: this.startTime,
            end: new Date(),
          },
        });
      });
    }, interval);
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.metrics.clear();
    this.responseTimes.clear();
  }

  /**
   * Create default adapter metrics
   */
  private createAdapterMetrics(): AdapterMetrics {
    return {
      overall: this.createServiceMetrics(),
    };
  }

  /**
   * Create default service metrics
   */
  private createServiceMetrics(): ServiceMetrics {
    return {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      pendingRequests: 0,
      averageResponseTime: 0,
      minResponseTime: 0,
      maxResponseTime: 0,
      errorRate: 0,
    };
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.length = 0;
  }
}
