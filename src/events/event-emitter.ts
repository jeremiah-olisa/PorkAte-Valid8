import EventEmitter from 'eventemitter3';
import {
  VerificationEventType,
  EventData,
  BaseEventData,
} from '../types/event-types';

export interface EventListener<T extends EventData = EventData> {
  (data: T): void | Promise<void>;
}

export interface EventSubscription {
  unsubscribe(): void;
}

/**
 * Centralized Event Emitter for @porkate/valid8
 * Provides comprehensive event logging for monitoring and analytics
 */
export class VerificationEventEmitter {
  private readonly emitter: EventEmitter;
  private readonly eventHistory: Map<string, EventData[]> = new Map();
  private readonly maxHistorySize: number;
  private isRecording: boolean = false;

  constructor(maxHistorySize: number = 1000) {
    this.emitter = new EventEmitter();
    this.maxHistorySize = maxHistorySize;
  }

  /**
   * Emit an event
   */
  emit<T extends EventData = EventData>(
    eventType: VerificationEventType,
    data: Omit<T, keyof BaseEventData> & Partial<BaseEventData>,
  ): void {
    const enrichedData = this.enrichEventData(data) as T;

    // Store in history if recording is enabled
    if (this.isRecording) {
      this.addToHistory(eventType, enrichedData);
    }

    // Emit the event
    this.emitter.emit(eventType, enrichedData);
    this.emitter.emit('*', eventType, enrichedData); // Wildcard listener
  }

  /**
   * Subscribe to a specific event
   */
  on<T extends EventData = EventData>(
    eventType: VerificationEventType | '*',
    listener: EventListener<T>,
  ): EventSubscription {
    this.emitter.on(eventType, listener);

    return {
      unsubscribe: () => {
        this.emitter.off(eventType, listener);
      },
    };
  }

  /**
   * Subscribe to an event once
   */
  once<T extends EventData = EventData>(
    eventType: VerificationEventType,
    listener: EventListener<T>,
  ): EventSubscription {
    this.emitter.once(eventType, listener);

    return {
      unsubscribe: () => {
        this.emitter.off(eventType, listener);
      },
    };
  }

  /**
   * Unsubscribe from an event
   */
  off<T extends EventData = EventData>(
    eventType: VerificationEventType | '*',
    listener: EventListener<T>,
  ): void {
    this.emitter.off(eventType, listener);
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(eventType?: VerificationEventType): void {
    this.emitter.removeAllListeners(eventType);
  }

  /**
   * Get the number of listeners for an event
   */
  listenerCount(eventType: VerificationEventType): number {
    return this.emitter.listenerCount(eventType);
  }

  /**
   * Enable event history recording
   */
  startRecording(): void {
    this.isRecording = true;
  }

  /**
   * Disable event history recording
   */
  stopRecording(): void {
    this.isRecording = false;
  }

  /**
   * Get event history for a specific event type
   */
  getHistory(eventType?: VerificationEventType): EventData[] {
    if (eventType) {
      return this.eventHistory.get(eventType) || [];
    }

    // Return all history
    const allHistory: EventData[] = [];
    this.eventHistory.forEach((events) => {
      allHistory.push(...events);
    });

    return allHistory.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );
  }

  /**
   * Clear event history
   */
  clearHistory(eventType?: VerificationEventType): void {
    if (eventType) {
      this.eventHistory.delete(eventType);
    } else {
      this.eventHistory.clear();
    }
  }

  /**
   * Get statistics for events
   */
  getStatistics(): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    oldestEvent?: Date;
    newestEvent?: Date;
  } {
    let totalEvents = 0;
    const eventsByType: Record<string, number> = {};
    let oldestEvent: Date | undefined;
    let newestEvent: Date | undefined;

    this.eventHistory.forEach((events, type) => {
      totalEvents += events.length;
      eventsByType[type] = events.length;

      events.forEach((event) => {
        if (!oldestEvent || event.timestamp < oldestEvent) {
          oldestEvent = event.timestamp;
        }
        if (!newestEvent || event.timestamp > newestEvent) {
          newestEvent = event.timestamp;
        }
      });
    });

    return {
      totalEvents,
      eventsByType,
      oldestEvent,
      newestEvent,
    };
  }

  /**
   * Enrich event data with base properties
   */
  private enrichEventData(data: Partial<BaseEventData>): BaseEventData {
    return {
      eventId: this.generateEventId(),
      timestamp: new Date(),
      ...data,
    };
  }

  /**
   * Add event to history
   */
  private addToHistory(eventType: VerificationEventType, data: EventData): void {
    if (!this.eventHistory.has(eventType)) {
      this.eventHistory.set(eventType, []);
    }

    const history = this.eventHistory.get(eventType)!;
    history.push(data);

    // Maintain max history size
    if (history.length > this.maxHistorySize) {
      history.shift();
    }
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const globalEventEmitter = new VerificationEventEmitter();
