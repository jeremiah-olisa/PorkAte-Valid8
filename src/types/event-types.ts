export enum VerificationEventType {
  // Lifecycle Events
  VERIFICATION_STARTED = 'verification.started',
  VERIFICATION_COMPLETED = 'verification.completed',
  VERIFICATION_FAILED = 'verification.failed',
  VERIFICATION_RETRY = 'verification.retry',
  
  // Service Specific Events
  NIN_VERIFICATION = 'nin.verification',
  BVN_VERIFICATION = 'bvn.verification',
  VOTERS_CARD_VERIFICATION = 'voters_card.verification',
  PASSPORT_VERIFICATION = 'passport.verification',
  TIN_VERIFICATION = 'tin.verification',
  VEHICLE_VERIFICATION = 'vehicle.verification',
  CAC_VERIFICATION = 'cac.verification',
  PHONE_VERIFICATION = 'phone.verification',
  BANK_ACCOUNT_VERIFICATION = 'bank_account.verification',
  CREDIT_BUREAU_VERIFICATION = 'credit_bureau.verification',
  
  // Adapter Events
  ADAPTER_INITIALIZED = 'adapter.initialized',
  ADAPTER_ERROR = 'adapter.error',
  ADAPTER_SWITCHED = 'adapter.switched',
  ADAPTER_FALLBACK = 'adapter.fallback',
  
  // Performance Events
  REQUEST_SENT = 'request.sent',
  RESPONSE_RECEIVED = 'response.received',
  RATE_LIMIT_HIT = 'rate_limit.hit',
  TIMEOUT_OCCURRED = 'timeout.occurred',
  
  // Monitoring Events
  HEALTH_CHECK = 'health.check',
  METRICS_COLLECTED = 'metrics.collected',
}

export enum VerificationStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  TIMEOUT = 'timeout',
  RATE_LIMITED = 'rate_limited',
  INVALID_DATA = 'invalid_data',
}

export enum ServiceType {
  NIN = 'nin',
  BVN = 'bvn',
  VOTERS_CARD = 'voters_card',
  PASSPORT = 'passport',
  TIN = 'tin',
  VEHICLE = 'vehicle',
  CAC = 'cac',
  PHONE = 'phone',
  BANK_ACCOUNT = 'bank_account',
  CREDIT_BUREAU = 'credit_bureau',
}

export interface BaseEventData {
  eventId: string;
  timestamp: Date;
  environment?: string;
  userId?: string;
  sessionId?: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface VerificationEventData extends BaseEventData {
  serviceType: ServiceType;
  adapter: string;
  status: VerificationStatus;
  duration?: number;
  requestData?: any;
  responseData?: any;
  error?: {
    code: string;
    message: string;
    stack?: string;
  };
}

export interface AdapterEventData extends BaseEventData {
  adapter: string;
  action: string;
  previousAdapter?: string;
  reason?: string;
  config?: Record<string, any>;
}

export interface PerformanceEventData extends BaseEventData {
  adapter: string;
  serviceType?: ServiceType;
  duration: number;
  requestSize?: number;
  responseSize?: number;
  statusCode?: number;
  endpoint?: string;
}

export interface MetricsEventData extends BaseEventData {
  adapter: string;
  metrics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
  };
  period: {
    start: Date;
    end: Date;
  };
}

export interface HealthCheckEventData extends BaseEventData {
  adapter: string;
  isHealthy: boolean;
  checks: Array<{
    name: string;
    status: 'pass' | 'fail';
    message?: string;
    duration?: number;
  }>;
}

export type EventData =
  | VerificationEventData
  | AdapterEventData
  | PerformanceEventData
  | MetricsEventData
  | HealthCheckEventData;
