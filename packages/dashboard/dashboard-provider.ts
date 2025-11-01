import { VerificationEventEmitter } from '@porkate/valid8';
import { MetricsCollector, MetricsSnapshot } from '@porkate/valid8';
import {
  VerificationEventType,
  EventData,
  VerificationEventData,
  ServiceType,
  VerificationStatus,
} from '@porkate/valid8';

export interface DashboardConfig {
  enableRealtime?: boolean;
  historySize?: number;
  metricsInterval?: number;
}

export interface RecentActivity {
  id: string;
  timestamp: Date;
  serviceType: ServiceType;
  adapter: string;
  status: VerificationStatus;
  duration?: number;
  error?: string;
}

export interface ServiceStatusSummary {
  service: ServiceType;
  total: number;
  success: number;
  failed: number;
  successRate: number;
  averageTime: number;
}

export interface AdapterHealthStatus {
  adapter: string;
  isHealthy: boolean;
  uptime: number;
  totalRequests: number;
  errorRate: number;
  lastActivity?: Date;
}

export interface DashboardData {
  summary: {
    totalVerifications: number;
    successfulVerifications: number;
    failedVerifications: number;
    successRate: number;
    averageResponseTime: number;
  };
  recentActivity: RecentActivity[];
  serviceStatus: ServiceStatusSummary[];
  adapterHealth: AdapterHealthStatus[];
  metrics: MetricsSnapshot;
  timeline: Array<{
    timestamp: Date;
    eventType: VerificationEventType;
    count: number;
  }>;
}

/**
 * Dashboard Data Provider - Provides data for Hangfire-style UI dashboard
 */
export class DashboardDataProvider {
  private readonly emitter: VerificationEventEmitter;
  private readonly metricsCollector: MetricsCollector;
  private readonly recentActivities: RecentActivity[] = [];
  private readonly maxActivities: number;
  private updateCallbacks: Set<(data: DashboardData) => void> = new Set();

  constructor(
    emitter: VerificationEventEmitter,
    config: DashboardConfig = {},
  ) {
    this.emitter = emitter;
    this.maxActivities = config.historySize || 100;

    // Initialize metrics collector
    this.metricsCollector = new MetricsCollector(emitter, {
      emitInterval: config.metricsInterval || 60000, // 1 minute
      maxResponseTimeSamples: 100,
    });

    // Start recording events
    this.emitter.startRecording();

    // Setup listeners
    this.setupListeners();
  }

  /**
   * Setup event listeners
   */
  private setupListeners(): void {
    // Listen to all verification events
    this.emitter.on('*', (eventType: VerificationEventType, data: EventData) => {
      if (this.isVerificationEvent(eventType)) {
        this.handleVerificationEvent(data as VerificationEventData);
      }

      // Notify subscribers
      this.notifySubscribers();
    });
  }

  /**
   * Check if event is a verification event
   */
  private isVerificationEvent(eventType: VerificationEventType): boolean {
    return (
      eventType.includes('verification') &&
      !eventType.includes('started') &&
      !eventType.includes('retry')
    );
  }

  /**
   * Handle verification events
   */
  private handleVerificationEvent(data: VerificationEventData): void {
    const activity: RecentActivity = {
      id: data.eventId,
      timestamp: data.timestamp,
      serviceType: data.serviceType,
      adapter: data.adapter,
      status: data.status,
      duration: data.duration,
      error: data.error?.message,
    };

    this.recentActivities.unshift(activity);

    // Maintain max size
    if (this.recentActivities.length > this.maxActivities) {
      this.recentActivities.pop();
    }
  }

  /**
   * Get complete dashboard data
   */
  getDashboardData(): DashboardData {
    const metrics = this.metricsCollector.getSnapshot();
    const summary = this.calculateSummary(metrics);
    const serviceStatus = this.calculateServiceStatus(metrics);
    const adapterHealth = this.calculateAdapterHealth(metrics);
    const timeline = this.calculateTimeline();

    return {
      summary,
      recentActivity: this.recentActivities,
      serviceStatus,
      adapterHealth,
      metrics,
      timeline,
    };
  }

  /**
   * Calculate summary statistics
   */
  private calculateSummary(metrics: MetricsSnapshot) {
    return {
      totalVerifications: metrics.global.totalRequests,
      successfulVerifications: metrics.global.totalSuccesses,
      failedVerifications: metrics.global.totalFailures,
      successRate: metrics.global.errorRate > 0 ? 1 - metrics.global.errorRate : 1,
      averageResponseTime: metrics.global.averageResponseTime,
    };
  }

  /**
   * Calculate service status
   */
  private calculateServiceStatus(metrics: MetricsSnapshot): ServiceStatusSummary[] {
    const serviceMap = new Map<ServiceType, ServiceStatusSummary>();

    Object.entries(metrics.adapters).forEach(([_adapterName, adapterMetrics]) => {
      Object.entries(adapterMetrics).forEach(([serviceType, serviceMetrics]) => {
        if (serviceType === 'overall') return;

        if (!serviceMap.has(serviceType as ServiceType)) {
          serviceMap.set(serviceType as ServiceType, {
            service: serviceType as ServiceType,
            total: 0,
            success: 0,
            failed: 0,
            successRate: 0,
            averageTime: 0,
          });
        }

        const summary = serviceMap.get(serviceType as ServiceType)!;
        summary.total += serviceMetrics.totalRequests;
        summary.success += serviceMetrics.successfulRequests;
        summary.failed += serviceMetrics.failedRequests;
        summary.averageTime =
          (summary.averageTime * (summary.total - serviceMetrics.totalRequests) +
            serviceMetrics.averageResponseTime * serviceMetrics.totalRequests) /
          summary.total;
      });
    });

    // Calculate success rates
    serviceMap.forEach((summary) => {
      summary.successRate = summary.total > 0 ? summary.success / summary.total : 0;
    });

    return Array.from(serviceMap.values()).sort((a, b) => b.total - a.total);
  }

  /**
   * Calculate adapter health
   */
  private calculateAdapterHealth(metrics: MetricsSnapshot): AdapterHealthStatus[] {
    return Object.entries(metrics.adapters).map(([adapter, adapterMetrics]) => {
      const overall = adapterMetrics.overall;
      return {
        adapter,
        isHealthy: overall.errorRate < 0.1, // Less than 10% error rate
        uptime: metrics.global.uptime,
        totalRequests: overall.totalRequests,
        errorRate: overall.errorRate,
        lastActivity: overall.lastRequest,
      };
    });
  }

  /**
   * Calculate timeline data
   */
  private calculateTimeline(): Array<{
    timestamp: Date;
    eventType: VerificationEventType;
    count: number;
  }> {
    const history = this.emitter.getHistory();
    const timelineMap = new Map<string, Map<VerificationEventType, number>>();

    // Group by 5-minute intervals
    history.forEach((event) => {
      const intervalKey = this.getIntervalKey(event.timestamp, 5);

      if (!timelineMap.has(intervalKey)) {
        timelineMap.set(intervalKey, new Map());
      }

      const eventMap = timelineMap.get(intervalKey)!;
      const eventType = this.getEventTypeFromHistory(event);
      eventMap.set(eventType, (eventMap.get(eventType) || 0) + 1);
    });

    // Convert to array
    const timeline: Array<{
      timestamp: Date;
      eventType: VerificationEventType;
      count: number;
    }> = [];

    timelineMap.forEach((eventMap, intervalKey) => {
      const timestamp = new Date(intervalKey);
      eventMap.forEach((count, eventType) => {
        timeline.push({ timestamp, eventType, count });
      });
    });

    return timeline.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 50);
  }

  /**
   * Get interval key for grouping
   */
  private getIntervalKey(date: Date, minutes: number): string {
    const ms = minutes * 60 * 1000;
    const roundedTime = Math.floor(date.getTime() / ms) * ms;
    return new Date(roundedTime).toISOString();
  }

  /**
   * Get event type from history data
   */
  private getEventTypeFromHistory(data: EventData): VerificationEventType {
    if ('serviceType' in data) {
      return VerificationEventType.VERIFICATION_COMPLETED;
    }
    return VerificationEventType.VERIFICATION_STARTED;
  }

  /**
   * Subscribe to dashboard updates
   */
  subscribe(callback: (data: DashboardData) => void): () => void {
    this.updateCallbacks.add(callback);

    // Return unsubscribe function
    return () => {
      this.updateCallbacks.delete(callback);
    };
  }

  /**
   * Notify all subscribers
   */
  private notifySubscribers(): void {
    const data = this.getDashboardData();
    this.updateCallbacks.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in dashboard subscriber:', error);
      }
    });
  }

  /**
   * Get recent activities
   */
  getRecentActivities(limit: number = 20): RecentActivity[] {
    return this.recentActivities.slice(0, limit);
  }

  /**
   * Get activities by service type
   */
  getActivitiesByService(serviceType: ServiceType, limit: number = 20): RecentActivity[] {
    return this.recentActivities
      .filter((activity) => activity.serviceType === serviceType)
      .slice(0, limit);
  }

  /**
   * Get activities by adapter
   */
  getActivitiesByAdapter(adapter: string, limit: number = 20): RecentActivity[] {
    return this.recentActivities
      .filter((activity) => activity.adapter === adapter)
      .slice(0, limit);
  }

  /**
   * Get activities by status
   */
  getActivitiesByStatus(status: VerificationStatus, limit: number = 20): RecentActivity[] {
    return this.recentActivities
      .filter((activity) => activity.status === status)
      .slice(0, limit);
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.recentActivities.length = 0;
    this.metricsCollector.reset();
    this.emitter.clearHistory();
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.updateCallbacks.clear();
    this.metricsCollector.destroy();
  }
}
