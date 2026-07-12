import { Router, Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError';

/**
 * Vehicles Router — /api/vehicles
 *
 * Placeholder module. Manages the fleet vehicle registry.
 *
 * Planned endpoints:
 *   GET    /api/vehicles           → list all vehicles (paginated, filterable)
 *   POST   /api/vehicles           → register a new vehicle
 *   GET    /api/vehicles/:id       → get vehicle details
 *   PUT    /api/vehicles/:id       → update vehicle information
 *   DELETE /api/vehicles/:id       → decommission a vehicle
 *   GET    /api/vehicles/:id/trips → get all trips for a vehicle
 */
const vehiclesRouter = Router();

vehiclesRouter.all('*', (_req: Request, _res: Response, next: NextFunction): void => {
  next(
    new AppError(
      'NOT_IMPLEMENTED',
      501,
      'Vehicles module is not yet implemented. Requires the database schema to be merged first.',
    ),
  );
});

export default vehiclesRouter;
