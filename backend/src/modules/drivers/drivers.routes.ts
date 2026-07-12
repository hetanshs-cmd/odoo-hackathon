import { Router, Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError';

/**
 * Drivers Router — /api/drivers
 *
 * Placeholder module. Manages driver profiles, licenses, and assignments.
 *
 * Planned endpoints:
 *   GET    /api/drivers            → list all drivers (paginated)
 *   POST   /api/drivers            → create driver profile
 *   GET    /api/drivers/:id        → get driver details
 *   PUT    /api/drivers/:id        → update driver information
 *   DELETE /api/drivers/:id        → deactivate a driver
 *   GET    /api/drivers/:id/trips  → get all trips assigned to a driver
 */
const driversRouter = Router();

driversRouter.all('*', (_req: Request, _res: Response, next: NextFunction): void => {
  next(
    new AppError(
      'NOT_IMPLEMENTED',
      501,
      'Drivers module is not yet implemented. Requires the database schema to be merged first.',
    ),
  );
});

export default driversRouter;
