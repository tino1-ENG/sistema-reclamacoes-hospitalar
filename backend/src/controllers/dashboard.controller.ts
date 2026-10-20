
import type { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service.js';

export class DashboardController {
  async getMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Autenticação necessária.' });
        return;
      }
      const metrics = await dashboardService.getMetrics(req.user);
      res.json({ success: true, data: metrics });
    } catch (err) {
      next(err);
    }
  }
}

export const dashboardController = new DashboardController();
