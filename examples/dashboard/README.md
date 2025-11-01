# @porkate/valid8 Dashboard & Events

This package includes comprehensive event logging and monitoring capabilities similar to Hangfire UI.

## Features

### 📊 Real-time Dashboard
- Live verification statistics
- Service status monitoring
- Adapter health checks
- Recent activity feed
- Performance metrics
- Timeline visualization

### 🎯 Event System
- 20+ event types
- Wildcard listeners
- Event history
- Metrics collection
- SSE (Server-Sent Events) support

### 📈 Metrics
- Success/failure rates
- Response times (min, max, average)
- Request volumes
- Error rates
- Adapter uptime

## Quick Start

### Express.js

```typescript
import express from 'express';
import { globalEventEmitter } from '@porkate/valid8/events';
import { DashboardDataProvider } from '@porkate/valid8/dashboard';
import { EventLogger, LogLevel } from '@porkate/valid8/events';

const app = express();

// Initialize dashboard
const dashboard = new DashboardDataProvider(globalEventEmitter, {
  enableRealtime: true,
  historySize: 500,
  metricsInterval: 30000,
});

// Initialize logger
const logger = new EventLogger(globalEventEmitter, {
  level: LogLevel.INFO,
  enableConsole: true,
});

// Dashboard endpoint
app.get('/api/dashboard', (req, res) => {
  res.json(dashboard.getDashboardData());
});

// Real-time updates via SSE
app.get('/api/dashboard/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  
  const unsubscribe = dashboard.subscribe((data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
  
  req.on('close', unsubscribe);
});

app.listen(3000);
```

### NestJS

```typescript
import { Module } from '@nestjs/common';
import { Valid8DashboardModule } from '@porkate/valid8/nest';

@Module({
  imports: [Valid8DashboardModule],
})
export class AppModule {}
```

## Event Types

### Verification Events
- `verification.started` - Verification process started
- `verification.completed` - Verification completed (success/failure)
- `verification.failed` - Verification explicitly failed
- `verification.retry` - Retry attempt

### Service-Specific Events
- `nin.verification` - NIN verification event
- `bvn.verification` - BVN verification event
- `voters_card.verification` - Voter's card verification
- `passport.verification` - Passport verification
- `tin.verification` - TIN verification
- `vehicle.verification` - Vehicle verification
- `cac.verification` - CAC verification
- `phone.verification` - Phone verification
- `bank_account.verification` - Bank account verification
- `credit_bureau.verification` - Credit bureau check

### Adapter Events
- `adapter.initialized` - Adapter initialized
- `adapter.error` - Adapter error occurred
- `adapter.switched` - Switched to different adapter
- `adapter.fallback` - Fallback to another adapter

### Performance Events
- `request.sent` - Request sent to provider
- `response.received` - Response received
- `rate_limit.hit` - Rate limit reached
- `timeout.occurred` - Request timeout

### Monitoring Events
- `health.check` - Health check performed
- `metrics.collected` - Metrics collection cycle

## Custom Event Listeners

### Listen to Specific Events

```typescript
import { globalEventEmitter } from '@porkate/valid8/events';
import { VerificationEventType } from '@porkate/valid8/types';

// Listen to successful verifications
globalEventEmitter.on(
  VerificationEventType.VERIFICATION_COMPLETED,
  (data) => {
    console.log('Verification completed:', data);
    
    // Send to analytics
    analytics.track('verification', {
      service: data.serviceType,
      status: data.status,
      duration: data.duration,
    });
  }
);

// Listen to failures
globalEventEmitter.on(
  VerificationEventType.VERIFICATION_FAILED,
  (data) => {
    // Alert team
    slack.send({
      channel: '#alerts',
      text: `Verification failed: ${data.serviceType}`,
    });
  }
);
```

### Listen to ALL Events

```typescript
// Wildcard listener
globalEventEmitter.on('*', (eventType, data) => {
  console.log('Event occurred:', eventType, data);
  
  // Log to database
  db.insert('events', {
    type: eventType,
    data: JSON.stringify(data),
    timestamp: new Date(),
  });
});
```

## Dashboard Data Structure

```typescript
interface DashboardData {
  summary: {
    totalVerifications: number;
    successfulVerifications: number;
    failedVerifications: number;
    successRate: number;
    averageResponseTime: number;
  };
  
  recentActivity: Array<{
    id: string;
    timestamp: Date;
    serviceType: ServiceType;
    adapter: string;
    status: VerificationStatus;
    duration?: number;
    error?: string;
  }>;
  
  serviceStatus: Array<{
    service: ServiceType;
    total: number;
    success: number;
    failed: number;
    successRate: number;
    averageTime: number;
  }>;
  
  adapterHealth: Array<{
    adapter: string;
    isHealthy: boolean;
    uptime: number;
    totalRequests: number;
    errorRate: number;
    lastActivity?: Date;
  }>;
  
  metrics: MetricsSnapshot;
  timeline: Array<{
    timestamp: Date;
    eventType: VerificationEventType;
    count: number;
  }>;
}
```

## Integration Examples

### Datadog Integration

```typescript
import { StatsD } from 'hot-shots';

const statsd = new StatsD();

globalEventEmitter.on('verification.completed', (data) => {
  statsd.increment('verification.count', {
    service: data.serviceType,
    status: data.status,
  });
  
  statsd.timing('verification.duration', data.duration, {
    service: data.serviceType,
  });
});
```

### Sentry Integration

```typescript
import * as Sentry from '@sentry/node';

globalEventEmitter.on('verification.failed', (data) => {
  Sentry.captureException(new Error(data.error?.message), {
    extra: {
      eventId: data.eventId,
      service: data.serviceType,
      adapter: data.adapter,
    },
  });
});
```

### Slack Integration

```typescript
import { WebClient } from '@slack/web-api';

const slack = new WebClient(process.env.SLACK_TOKEN);

globalEventEmitter.on('adapter.fallback', async (data) => {
  await slack.chat.postMessage({
    channel: '#monitoring',
    text: `⚠️ Adapter fallback: ${data.previousAdapter} → ${data.adapter}`,
  });
});
```

## Frontend Dashboard Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>@porkate/valid8 Dashboard</title>
  <style>
    .metric { padding: 20px; border: 1px solid #ddd; margin: 10px; }
    .success { color: green; }
    .error { color: red; }
  </style>
</head>
<body>
  <h1>Verification Dashboard</h1>
  
  <div id="summary"></div>
  <div id="activities"></div>
  
  <script>
    // Connect to SSE stream
    const eventSource = new EventSource('/api/valid8/dashboard/stream');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      updateDashboard(data);
    };
    
    function updateDashboard(data) {
      // Update summary
      document.getElementById('summary').innerHTML = `
        <div class="metric">
          <h2>Total Verifications: ${data.summary.totalVerifications}</h2>
          <p>Success Rate: ${(data.summary.successRate * 100).toFixed(2)}%</p>
          <p>Avg Response Time: ${data.summary.averageResponseTime}ms</p>
        </div>
      `;
      
      // Update recent activities
      const activitiesHtml = data.recentActivity
        .slice(0, 10)
        .map(activity => `
          <div class="activity ${activity.status}">
            <strong>${activity.serviceType}</strong> - 
            ${activity.status} - 
            ${activity.duration}ms - 
            ${new Date(activity.timestamp).toLocaleString()}
          </div>
        `)
        .join('');
      
      document.getElementById('activities').innerHTML = activitiesHtml;
    }
  </script>
</body>
</html>
```

## API Endpoints

### GET /api/valid8/dashboard
Get complete dashboard data

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": { ... },
    "recentActivity": [ ... ],
    "serviceStatus": [ ... ],
    "adapterHealth": [ ... ],
    "metrics": { ... },
    "timeline": [ ... ]
  }
}
```

### GET /api/valid8/dashboard/activities
Get recent activities with optional filters

**Query Parameters:**
- `limit` - Number of activities to return (default: 20)
- `serviceType` - Filter by service type
- `adapter` - Filter by adapter
- `status` - Filter by status

### GET /api/valid8/dashboard/metrics
Get current metrics snapshot

### GET /api/valid8/dashboard/stream
Server-Sent Events stream for real-time updates

## Best Practices

1. **Enable History Recording**
   ```typescript
   globalEventEmitter.startRecording();
   ```

2. **Set Appropriate Log Levels**
   ```typescript
   const logger = new EventLogger(globalEventEmitter, {
     level: process.env.NODE_ENV === 'production' 
       ? LogLevel.WARN 
       : LogLevel.DEBUG,
   });
   ```

3. **Implement Error Handling**
   ```typescript
   globalEventEmitter.on('verification.failed', async (data) => {
     try {
       await notifyTeam(data);
     } catch (error) {
       console.error('Failed to send notification:', error);
     }
   });
   ```

4. **Clean Up Listeners**
   ```typescript
   const subscription = globalEventEmitter.on('verification.completed', handler);
   
   // Later...
   subscription.unsubscribe();
   ```

5. **Rate Limit External Calls**
   Use debouncing or throttling when sending events to external services

## License

MIT
