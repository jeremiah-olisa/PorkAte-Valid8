import express from 'express';
import { VerificationManager } from '../../src/core/verification-manager';
import { globalEventEmitter } from '../../src/events/event-emitter';
import { EventLogger, LogLevel } from '../../src/events/event-logger';
import { DashboardDataProvider } from '../../src/dashboard/dashboard-provider';
import { DashboardRoutes } from '../../src/dashboard/dashboard-routes';

// Initialize Express app
const app = express();
app.use(express.json());

// Initialize event logging
const logger = new EventLogger(globalEventEmitter, {
  level: LogLevel.INFO,
  enableConsole: true,
});

// Initialize dashboard
const dashboardProvider = new DashboardDataProvider(globalEventEmitter, {
  enableRealtime: true,
  historySize: 500,
  metricsInterval: 30000, // 30 seconds
});

// Setup dashboard routes
const dashboardRoutes = new DashboardRoutes(dashboardProvider, {
  basePath: '/api/valid8/dashboard',
  enableSSE: true,
});

// Dashboard endpoints
app.get('/api/valid8/dashboard', dashboardRoutes.handleGetDashboard);
app.get('/api/valid8/dashboard/activities', dashboardRoutes.handleGetActivities);
app.get('/api/valid8/dashboard/metrics', dashboardRoutes.handleGetMetrics);
app.get('/api/valid8/dashboard/stream', dashboardRoutes.handleSSEStream);

// Custom event listeners example
globalEventEmitter.on('verification.completed', (data) => {
  console.log('✅ Verification completed:', data);
  
  // You can send to external monitoring service
  // sendToDatadog(data);
  // sendToNewRelic(data);
});

globalEventEmitter.on('verification.failed', (data) => {
  console.error('❌ Verification failed:', data);
  
  // Alert your team
  // sendSlackAlert(data);
  // sendPagerDutyAlert(data);
});

// Subscribe to real-time dashboard updates
dashboardProvider.subscribe((dashboardData) => {
  console.log('📊 Dashboard updated:', {
    totalVerifications: dashboardData.summary.totalVerifications,
    successRate: dashboardData.summary.successRate,
  });
  
  // Broadcast to WebSocket clients, etc.
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Dashboard server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/valid8/dashboard`);
  console.log(`📡 SSE Stream: http://localhost:${PORT}/api/valid8/dashboard/stream`);
});

export { app, dashboardProvider, globalEventEmitter };
