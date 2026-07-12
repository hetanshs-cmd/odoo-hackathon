import { Router, Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError';

/**
 * Maintenance Router — /api/maintenance
 *
 * Placeholder module. Tracks vehicle maintenance schedules and service records.
 *
 * Planned endpoints:
 *   GET    /api/maintenance        → list maintenance records (filterable by vehicle)
 *   POST   /api/maintenance        → log a new maintenance event
 *   GET    /api/maintenance/:id    → get maintenance record details
 *   PUT    /api/maintenance/:id    → update maintenance record
 *   DELETE /api/maintenance/:id    → delete maintenance record
 *   GET    /api/maintenance/due    → list vehicles with overdue maintenance
 */
const maintenanceRouter = Router();

maintenanceRouter.all('*', (_req: Request, _res: Response, next: NextFunction): void => {
  next(
    new AppError(
      'NOT_IMPLEMENTED',
      501,
      'Maintenance module is not yet implemented. Requires the database schema to be merged first.',
    ),
  );
});

export default maintenanceRouter;
