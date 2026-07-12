import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { AuthenticatedUser } from '../types/common';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('NOT_AUTHENTICATED', 401, 'No authentication token provided'));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new AppError('NOT_AUTHENTICATED', 401, 'No authentication token provided'));
  }

  const secret = env.JWT_ACCESS_SECRET || '';

  try {
    const decoded = jwt.verify(token, secret) as unknown as AuthenticatedUser;

    // Attach to request object
    req.user = decoded;

    next();
  } catch (error: unknown) {
    console.error('[requireAuth] JWT verify error:', error instanceof Error ? error.message : String(error));
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('NOT_AUTHENTICATED', 401, 'Authentication token expired'));
    }
    return next(new AppError('NOT_AUTHENTICATED', 401, 'Invalid authentication token'));
  }
};
