import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * asyncHandler — wraps an async route handler so any rejected Promise
 * is forwarded to Express's global error middleware via `next(err)`.
 *
 * Without this wrapper, an unhandled async rejection would crash the
 * process in older Node versions or produce an unhandled-rejection
 * warning in Node 20+, silently skipping the error handler.
 *
 * Usage (in any route file):
 *   router.get('/example', asyncHandler(async (req, res) => {
 *     const data = await someService.getData();
 *     res.json(success(data, 'Fetched successfully'));
 *   }));
 *
 * The wrapper preserves the full (req, res, next) Express signature so
 * it is compatible with all Express route and middleware positions.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
