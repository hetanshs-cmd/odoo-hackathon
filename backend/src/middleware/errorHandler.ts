import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/apiResponse';
import { env } from '../config/env';

/**
 * Global error handler middleware — MUST be registered LAST in app.ts
 * (Express identifies error handlers by their 4-argument signature).
 *
 * Behaviour:
 *   - AppError (isOperational=true)  → uses its statusCode + message safely
 *   - Zod / validation errors        → mapped to 400 VALIDATION_ERROR
 *   - JWT errors                     → mapped to 401 NOT_AUTHENTICATED
 *   - Everything else                → 500 INTERNAL_SERVER_ERROR, message hidden
 *
 * Security: raw error messages and stack traces are NEVER sent to the client.
 * In development NODE_ENV they are printed to stderr for debugging.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // ------------------------------------------------------------------
  // 1. Operational error — thrown intentionally by the service layer
  // ------------------------------------------------------------------
  if (err instanceof AppError && err.isOperational) {
    sendError(res, err.statusCode, err.code, err.message, err.details);
    return;
  }

  // ------------------------------------------------------------------
  // 2. JWT library errors
  // ------------------------------------------------------------------
  if (err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError') {
    sendError(res, 401, 'NOT_AUTHENTICATED', 'Invalid or malformed token.');
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 401, 'NOT_AUTHENTICATED', 'Token has expired. Please log in again.');
    return;
  }

  // ------------------------------------------------------------------
  // 3. Express body-parser errors (malformed JSON)
  // ------------------------------------------------------------------
  if (err.name === 'SyntaxError') {
    sendError(res, 400, 'VALIDATION_ERROR', 'Request body contains invalid JSON.');
    return;
  }

  // ------------------------------------------------------------------
  // 4. Unknown / programming error — log full context, hide from client
  // ------------------------------------------------------------------
  const context = {
    route: `${req.method} ${req.originalUrl}`,
    userId: req.user?.id ?? 'unauthenticated',
    timestamp: new Date().toISOString(),
    errorName: err.name,
    errorMessage: err.message,
    // Only include stack in non-production to avoid log flooding
    ...(env.NODE_ENV !== 'production' && { stack: err.stack }),
  };

  console.error('[TransitOps] Unhandled error:', context);

  sendError(
    res,
    500,
    'INTERNAL_SERVER_ERROR',
    'An unexpected error occurred. Please try again later.',
  );
};
