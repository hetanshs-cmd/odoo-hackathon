import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * notFound — catch-all handler for unmatched routes.
 *
 * Registered AFTER all other route definitions in app.ts.
 * Throws AppError('NOT_FOUND') which is then picked up by errorHandler
 * so the 404 response follows the same JSON envelope as all other errors.
 */
export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(
    new AppError(
      'NOT_FOUND',
      404,
      `The route ${req.method} ${req.originalUrl} does not exist on this server.`,
    ),
  );
};
