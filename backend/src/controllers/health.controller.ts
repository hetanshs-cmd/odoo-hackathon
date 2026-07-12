import { Request, Response } from 'express';

/**
 * healthCheck — GET /api/health
 *
 * Returns a minimal liveness probe so load balancers, CI pipelines,
 * and Kubernetes readiness probes can confirm the API process is running.
 *
 * Note: This does NOT check database connectivity — a proper readiness
 * probe that pings the DB will be added once the database branch is merged.
 *
 * No asyncHandler needed: this handler is fully synchronous.
 */
export const healthCheck = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: 'TransitOps API is running',
  });
};
