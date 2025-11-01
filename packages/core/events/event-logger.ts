import {
  VerificationEventEmitter,
  // EventListener is imported for type completeness but may not be directly used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  EventListener,
} from './event-emitter';
import {
  VerificationEventType,
  EventData,
  VerificationEventData,
  PerformanceEventData,
} from '../types/event-types';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LoggerConfig {
  level?: LogLevel;
  enableConsole?: boolean;
  customLogger?: (level: LogLevel, message: string, data?: any) => void;
  formatters?: {
    [key in VerificationEventType]?: (data: EventData) => string;
  };
}

/**
 * Event Logger - Provides structured logging for verification events
 */
export class EventLogger {
  private readonly emitter: VerificationEventEmitter;
  private readonly config: Required<LoggerConfig>;
  private readonly subscriptions: Array<{ unsubscribe: () => void }> = [];

  constructor(emitter: VerificationEventEmitter, config: LoggerConfig = {}) {
    this.emitter = emitter;
    this.config = {
      level: config.level || LogLevel.INFO,
      enableConsole: config.enableConsole ?? true,
      customLogger: config.customLogger || this.defaultLogger.bind(this),
      formatters: config.formatters || {},
    };

    this.setupListeners();
  }

  /**
   * Setup event listeners
   */
  private setupListeners(): void {
    // Listen to all events
    const subscription = this.emitter.on('*', this.handleEvent.bind(this));
    this.subscriptions.push(subscription);
  }

  /**
   * Handle incoming events
   */
  private handleEvent(eventType: VerificationEventType, data: EventData): void {
    const level = this.getLogLevel(eventType, data);

    if (!this.shouldLog(level)) {
      return;
    }

    const message = this.formatMessage(eventType, data);
    this.config.customLogger(level, message, data);
  }

  /**
   * Determine log level for event
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getLogLevel(eventType: VerificationEventType, data: EventData): LogLevel {
    if (eventType.includes('failed') || eventType.includes('error')) {
      return LogLevel.ERROR;
    }

    if (eventType.includes('fallback') || eventType.includes('retry')) {
      return LogLevel.WARN;
    }

    if (eventType.includes('started') || eventType.includes('sent')) {
      return LogLevel.DEBUG;
    }

    return LogLevel.INFO;
  }

  /**
   * Check if should log based on level
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const configLevelIndex = levels.indexOf(this.config.level);
    const eventLevelIndex = levels.indexOf(level);

    return eventLevelIndex >= configLevelIndex;
  }

  /**
   * Format log message
   */
  private formatMessage(eventType: VerificationEventType, data: EventData): string {
    // Use custom formatter if available
    if (this.config.formatters[eventType]) {
      return this.config.formatters[eventType]!(data);
    }

    // Default formatting
    const parts = [
      `[${eventType}]`,
      `ID: ${data.eventId}`,
    ];

    if ('adapter' in data) {
      parts.push(`Adapter: ${data.adapter}`);
    }

    if ('serviceType' in data) {
      parts.push(`Service: ${(data as VerificationEventData).serviceType}`);
    }

    if ('duration' in data) {
      parts.push(`Duration: ${(data as PerformanceEventData).duration}ms`);
    }

    if ('status' in data) {
      parts.push(`Status: ${(data as VerificationEventData).status}`);
    }

    return parts.join(' | ');
  }

  /**
   * Default console logger
   */
  private defaultLogger(level: LogLevel, message: string, data?: any): void {
    if (!this.config.enableConsole) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    switch (level) {
      case LogLevel.ERROR:
        console.error(logMessage, data);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, data);
        break;
      case LogLevel.DEBUG:
        console.debug(logMessage, data);
        break;
      default:
        console.log(logMessage, data);
    }
  }

  /**
   * Cleanup listeners
   */
  destroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.length = 0;
  }
}
