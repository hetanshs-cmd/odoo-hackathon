import { Router, Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError';

/**
 * Settings Router — /api/settings
 *
 * Placeholder module. Manages platform-wide configuration and user preferences.
 *
 * Planned endpoints:
 *   GET  /api/settings             → get current platform settings
 *   PUT  /api/settings             → update platform settings (admin only)
 *   GET  /api/settings/profile     → get current user's preferences
 *   PUT  /api/settings/profile     → update current user's preferences
 *   PUT  /api/settings/password    → change current user's password
 */
const settingsRouter = Router();

settingsRouter.all('*', (_req: Request, _res: Response, next: NextFunction): void => {
  next(
    new AppError(
      'NOT_IMPLEMENTED',
      501,
      'Settings module is not yet implemented. Requires the database schema to be merged first.',
    ),
  );
});

export default settingsRouter;
