/**
 * Example: Custom Event Listeners
 * 
 * This example shows how to listen to various events
 * and integrate with external services
 */

import { globalEventEmitter } from '../../src/events/event-emitter';
import {
  VerificationEventType,
  VerificationEventData,
  AdapterEventData,
  PerformanceEventData,
} from '../../src/types/event-types';

// Example 1: Listen to all verification completions
globalEventEmitter.on<VerificationEventData>(
  VerificationEventType.VERIFICATION_COMPLETED,
  async (data) => {
    console.log(`✅ ${data.serviceType} verification completed in ${data.duration}ms`);
    
    // Send to your analytics service
    // await analytics.track('verification_completed', {
    //   service: data.serviceType,
    //   adapter: data.adapter,
    //   duration: data.duration,
    //   status: data.status,
    // });
  }
);

// Example 2: Monitor failures
globalEventEmitter.on<VerificationEventData>(
  VerificationEventType.VERIFICATION_FAILED,
  async (data) => {
    console.error(`❌ ${data.serviceType} verification failed:`, data.error?.message);
    
    // Alert your team via Slack
    // await slackClient.send({
    //   channel: '#alerts',
    //   text: `Verification failed: ${data.serviceType}`,
    //   attachments: [{
    //     color: 'danger',
    //     fields: [
    //       { title: 'Service', value: data.serviceType },
    //       { title: 'Adapter', value: data.adapter },
    //       { title: 'Error', value: data.error?.message },
    //     ]
    //   }]
    // });
    
    // Send to error tracking service
    // Sentry.captureException(new Error(data.error?.message), {
    //   extra: {
    //     eventId: data.eventId,
    //     serviceType: data.serviceType,
    //     adapter: data.adapter,
    //   }
    // });
  }
);

// Example 3: Monitor performance
globalEventEmitter.on<PerformanceEventData>(
  VerificationEventType.RESPONSE_RECEIVED,
  async (data) => {
    if (data.duration > 5000) { // Alert if response takes > 5 seconds
      console.warn(`⚠️ Slow response from ${data.adapter}: ${data.duration}ms`);
      
      // Send performance metric
      // await metrics.gauge('verification.response_time', data.duration, {
      //   adapter: data.adapter,
      //   service: data.serviceType,
      // });
    }
  }
);

// Example 4: Track adapter switching
globalEventEmitter.on<AdapterEventData>(
  VerificationEventType.ADAPTER_FALLBACK,
  async (data) => {
    console.warn(`🔄 Adapter fallback: ${data.previousAdapter} → ${data.adapter}`);
    console.log(`Reason: ${data.reason}`);
    
    // Increment fallback counter
    // await metrics.increment('adapter.fallback', {
    //   from: data.previousAdapter,
    //   to: data.adapter,
    // });
  }
);

// Example 5: Rate limit monitoring
globalEventEmitter.on(
  VerificationEventType.RATE_LIMIT_HIT,
  async (data) => {
    console.warn(`⏱️ Rate limit hit on ${data.adapter}`);
    
    // Alert if rate limits are hit frequently
    // await pagerDuty.trigger({
    //   routing_key: process.env.PAGERDUTY_KEY,
    //   event_action: 'trigger',
    //   payload: {
    //     summary: `Rate limit hit on ${data.adapter}`,
    //     severity: 'warning',
    //     source: 'porkate-valid8',
    //   }
    // });
  }
);

// Example 6: Listen to ALL events (wildcard)
globalEventEmitter.on('*', (eventType, data) => {
  // Log all events to a centralized logging service
  // logger.info('Event occurred', {
  //   eventType,
  //   eventId: data.eventId,
  //   timestamp: data.timestamp,
  //   data,
  // });
  
  // Send to your data warehouse
  // await dataWarehouse.insert('verification_events', {
  //   event_type: eventType,
  //   event_data: JSON.stringify(data),
  //   created_at: new Date(),
  // });
});

// Example 7: Custom metrics collection
class CustomMetricsCollector {
  private successCount = 0;
  private failureCount = 0;
  
  constructor() {
    this.setupListeners();
  }
  
  private setupListeners() {
    globalEventEmitter.on<VerificationEventData>(
      VerificationEventType.VERIFICATION_COMPLETED,
      (data) => {
        if (data.status === 'success') {
          this.successCount++;
        } else {
          this.failureCount++;
        }
        
        // Emit custom metrics every 100 verifications
        if ((this.successCount + this.failureCount) % 100 === 0) {
          this.emitMetrics();
        }
      }
    );
  }
  
  private emitMetrics() {
    console.log('📊 Custom Metrics:', {
      success: this.successCount,
      failure: this.failureCount,
      successRate: this.successCount / (this.successCount + this.failureCount),
    });
  }
}

// Example 8: Database persistence
class EventPersistence {
  constructor(private db: any) {
    this.setupPersistence();
  }
  
  private setupPersistence() {
    // Persist all verification events to database
    globalEventEmitter.on('*', async (eventType, data) => {
      try {
        await this.db.query(
          'INSERT INTO verification_events (event_type, event_data, created_at) VALUES ($1, $2, $3)',
          [eventType, JSON.stringify(data), new Date()]
        );
      } catch (error) {
        console.error('Failed to persist event:', error);
      }
    });
  }
}

export {
  CustomMetricsCollector,
  EventPersistence,
};
