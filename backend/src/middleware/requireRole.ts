import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { UserRole } from '../types/common';

/**
 * requireRole - Middleware to restrict access based on roles.
 * Must be used AFTER requireAuth middleware.
 *
 * @param allowedRoles Array of roles allowed to access the route
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('NOT_AUTHENTICATED', 401, 'Authentication required for this route'));
    }

    if (!req.user.role || !allowedRoles.includes(req.user.role as UserRole)) {
      return next(
        new AppError('FORBIDDEN', 403, 'You do not have permission to perform this action'),
      );
    }

    next();
  };
};
