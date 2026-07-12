import { Router, Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError';

/**
 * Auth Router — /api/auth
 *
 * Placeholder module. Business logic will be implemented in a dedicated
 * feature branch (feature/auth-*) after the database schema is merged.
 *
 * Planned endpoints:
 *   POST /api/auth/signup       → register a new user
 *   POST /api/auth/login        → authenticate and issue JWT pair
 *   POST /api/auth/refresh      → exchange refresh token for new access token
 *   POST /api/auth/logout       → invalidate refresh token
 *   GET  /api/auth/me           → get current authenticated user's profile
 */
const authRouter = Router();

// Temporary placeholder — all auth routes return 501 Not Implemented
authRouter.all('*', (_req: Request, _res: Response, next: NextFunction): void => {
  next(
    new AppError(
      'NOT_IMPLEMENTED',
      501,
      'Auth module is not yet implemented. It will be available after the database schema branch is merged.',
    ),
  );
});

export default authRouter;
