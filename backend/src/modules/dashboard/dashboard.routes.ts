import { Router, Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError';

/**
 * Dashboard Router — /api/dashboard
 *
 * Placeholder module. Will aggregate KPIs and summary data for the
 * fleet operations dashboard once vehicle, driver, and trip modules
 * are implemented.
 *
 * Planned endpoints:
 *   GET /api/dashboard/summary     → fleet-level KPI snapshot
 *   GET /api/dashboard/alerts      → active maintenance and compliance alerts
 */
const dashboardRouter = Router();

dashboardRouter.all('*', (_req: Request, _res: Response, next: NextFunction): void => {
  next(
    new AppError(
      'NOT_IMPLEMENTED',
      501,
      'Dashboard module is not yet implemented. It will aggregate data from vehicles, drivers, and trips modules.',
    ),
  );
});

export default dashboardRouter;
