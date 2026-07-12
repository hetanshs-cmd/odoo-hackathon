import { Router, Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError';

/**
 * Trips Router — /api/trips
 *
 * Placeholder module. Manages trip scheduling, assignment, and tracking.
 *
 * Planned endpoints:
 *   GET    /api/trips              → list trips (paginated, filterable by status/driver/vehicle)
 *   POST   /api/trips              → create a new trip
 *   GET    /api/trips/:id          → get trip details
 *   PUT    /api/trips/:id          → update trip (route, schedule)
 *   PATCH  /api/trips/:id/status   → update trip status (pending/active/completed/cancelled)
 *   DELETE /api/trips/:id          → cancel a trip
 */
const tripsRouter = Router();

tripsRouter.all('*', (_req: Request, _res: Response, next: NextFunction): void => {
  next(
    new AppError(
      'NOT_IMPLEMENTED',
      501,
      'Trips module is not yet implemented. Requires the database schema to be merged first.',
    ),
  );
});

export default tripsRouter;
