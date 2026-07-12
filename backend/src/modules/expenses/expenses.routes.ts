import { Router, Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError';

/**
 * Expenses Router — /api/expenses
 *
 * Placeholder module. Tracks operational expenses per vehicle or trip.
 *
 * Planned endpoints:
 *   GET    /api/expenses           → list expense records (filterable by category/date/vehicle)
 *   POST   /api/expenses           → create an expense record
 *   GET    /api/expenses/:id       → get expense details
 *   PUT    /api/expenses/:id       → update expense record
 *   DELETE /api/expenses/:id       → delete expense record
 */
const expensesRouter = Router();

expensesRouter.all('*', (_req: Request, _res: Response, next: NextFunction): void => {
  next(
    new AppError(
      'NOT_IMPLEMENTED',
      501,
      'Expenses module is not yet implemented. Requires the database schema to be merged first.',
    ),
  );
});

export default expensesRouter;
