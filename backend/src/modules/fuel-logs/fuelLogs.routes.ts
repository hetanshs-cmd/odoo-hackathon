import { Router, Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError';

/**
 * Fuel Logs Router — /api/fuel-logs
 *
 * Placeholder module. Records and analyses fuel consumption per vehicle.
 *
 * Planned endpoints:
 *   GET    /api/fuel-logs          → list fuel log entries (filterable by vehicle/date)
 *   POST   /api/fuel-logs          → create a fuel log entry
 *   GET    /api/fuel-logs/:id      → get fuel log details
 *   PUT    /api/fuel-logs/:id      → correct a fuel log entry
 *   DELETE /api/fuel-logs/:id      → delete a fuel log entry
 */
const fuelLogsRouter = Router();

fuelLogsRouter.all('*', (_req: Request, _res: Response, next: NextFunction): void => {
  next(
    new AppError(
      'NOT_IMPLEMENTED',
      501,
      'Fuel Logs module is not yet implemented. Requires the database schema to be merged first.',
    ),
  );
});

export default fuelLogsRouter;
