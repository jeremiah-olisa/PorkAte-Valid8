import { DashboardDataProvider } from './dashboard-provider';

export interface DashboardRoutesOptions {
  basePath?: string;
  enableSSE?: boolean;
}

/**
 * Dashboard Routes - Express middleware for dashboard endpoints
 */
export class DashboardRoutes {
  private readonly provider: DashboardDataProvider;
  private readonly options: Required<DashboardRoutesOptions>;
  private sseClients: Set<any> = new Set();

  constructor(provider: DashboardDataProvider, options: DashboardRoutesOptions = {}) {
    this.provider = provider;
    this.options = {
      basePath: options.basePath || '/api/valid8/dashboard',
      enableSSE: options.enableSSE ?? true,
    };

    if (this.options.enableSSE) {
      this.setupSSE();
    }
  }

  /**
   * Get Express router
   */
  getRouter(): any {
    // Note: This would return an Express Router in actual implementation
    // For now, we'll just define the route handlers
    return {
      get: (path: string, handler: Function) => ({ path, handler }),
    };
  }

  /**
   * Setup Server-Sent Events
   */
  private setupSSE(): void {
    this.provider.subscribe((data) => {
      this.broadcastToSSEClients(data);
    });
  }

  /**
   * Broadcast to all SSE clients
   */
  private broadcastToSSEClients(data: any): void {
    this.sseClients.forEach((client) => {
      try {
        client.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (error) {
        this.sseClients.delete(client);
      }
    });
  }

  /**
   * Route: Get complete dashboard data
   */
  handleGetDashboard = (req: any, res: any) => {
    try {
      const data = this.provider.getDashboardData();
      res?.json({
        success: true,
        data,
      });
    } catch (error) {
      res?.status(500)?.json({
        success: false,
        error: (error as Error).message,
      });
    }
  };

  /**
   * Route: Get recent activities
   */
  handleGetActivities = (req: any, res: any) => {
    try {
      const limit = parseInt(req.query.limit || '20', 10);
      const serviceType = req.query.serviceType;
      const adapter = req.query.adapter;
      const status = req.query.status;

      let activities;
      if (serviceType) {
        activities = this.provider.getActivitiesByService(serviceType, limit);
      } else if (adapter) {
        activities = this.provider.getActivitiesByAdapter(adapter, limit);
      } else if (status) {
        activities = this.provider.getActivitiesByStatus(status, limit);
      } else {
        activities = this.provider.getRecentActivities(limit);
      }

      res.json({
        success: true,
        data: activities,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  };

  /**
   * Route: SSE stream
   */
  handleSSEStream = (req: any, res: any) => {
    if (!this.options.enableSSE) {
      res.status(404).json({ error: 'SSE not enabled' });
      return;
    }

    // Setup SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Add client
    this.sseClients.add(res);

    // Send initial data
    const initialData = this.provider.getDashboardData();
    res.write(`data: ${JSON.stringify(initialData)}\n\n`);

    // Remove client on disconnect
    req.on('close', () => {
      this.sseClients.delete(res);
    });
  };

  /**
   * Route: Get metrics
   */
  handleGetMetrics = (req: any, res: any) => {
    try {
      const data = this.provider.getDashboardData();
      res.json({
        success: true,
        data: data.metrics,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  };
}
