import { Router, Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError';

/**
 * Reports Router — /api/reports
 *
 * Placeholder module. Generates aggregated fleet analytics and exportable reports.
 *
 * Planned endpoints:
 *   GET /api/reports/fleet-summary       → total vehicles, active trips, utilization rate
 *   GET /api/reports/fuel-consumption    → fuel usage over time, per vehicle
 *   GET /api/reports/expense-breakdown   → expense totals by category
 *   GET /api/reports/driver-performance  → trips completed, punctuality per driver
 *   GET /api/reports/maintenance-history → maintenance events timeline
 */
const reportsRouter = Router();

reportsRouter.all('*', (_req: Request, _res: Response, next: NextFunction): void => {
  next(
    new AppError(
      'NOT_IMPLEMENTED',
      501,
      'Reports module is not yet implemented. It will aggregate data from all other modules.',
    ),
  );
});

export default reportsRouter;
