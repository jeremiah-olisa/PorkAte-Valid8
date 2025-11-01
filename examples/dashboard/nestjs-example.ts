import { Module, Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { globalEventEmitter } from '../../src/events/event-emitter';
import { DashboardDataProvider } from '../../src/dashboard/dashboard-provider';
import { EventLogger, LogLevel } from '../../src/events/event-logger';

// Dashboard Controller
@Controller('api/valid8/dashboard')
export class DashboardController {
  constructor(private readonly dashboardProvider: DashboardDataProvider) {}

  @Get()
  getDashboard() {
    return {
      success: true,
      data: this.dashboardProvider.getDashboardData(),
    };
  }

  @Get('activities')
  getActivities(
    @Query('limit') limit?: string,
    @Query('serviceType') serviceType?: string,
    @Query('adapter') adapter?: string,
    @Query('status') status?: string,
  ) {
    const limitNum = parseInt(limit || '20', 10);
    
    let activities;
    if (serviceType) {
      activities = this.dashboardProvider.getActivitiesByService(serviceType as any, limitNum);
    } else if (adapter) {
      activities = this.dashboardProvider.getActivitiesByAdapter(adapter, limitNum);
    } else if (status) {
      activities = this.dashboardProvider.getActivitiesByStatus(status as any, limitNum);
    } else {
      activities = this.dashboardProvider.getRecentActivities(limitNum);
    }

    return {
      success: true,
      data: activities,
    };
  }

  @Get('metrics')
  getMetrics() {
    const data = this.dashboardProvider.getDashboardData();
    return {
      success: true,
      data: data.metrics,
    };
  }

  @Get('stream')
  streamEvents(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send initial data
    const initialData = this.dashboardProvider.getDashboardData();
    res.write(`data: ${JSON.stringify(initialData)}\n\n`);

    // Subscribe to updates
    const unsubscribe = this.dashboardProvider.subscribe((data) => {
      try {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (error) {
        unsubscribe();
      }
    });

    // Cleanup on disconnect
    res.on('close', () => {
      unsubscribe();
    });
  }
}

// Dashboard Module
@Module({
  controllers: [DashboardController],
  providers: [
    {
      provide: DashboardDataProvider,
      useFactory: () => {
        return new DashboardDataProvider(globalEventEmitter, {
          enableRealtime: true,
          historySize: 500,
          metricsInterval: 30000,
        });
      },
    },
    {
      provide: EventLogger,
      useFactory: () => {
        return new EventLogger(globalEventEmitter, {
          level: LogLevel.INFO,
          enableConsole: true,
        });
      },
    },
  ],
  exports: [DashboardDataProvider, EventLogger],
})
export class Valid8DashboardModule {}
