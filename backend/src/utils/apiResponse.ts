import { Response } from 'express';
import { ApiSuccessResponse, ApiErrorResponse } from '../types/common';

/**
 * apiResponse — centralized factory for all JSON response envelopes.
 *
 * Every controller MUST use these helpers instead of writing raw `res.json({})`
 * so the envelope shape is guaranteed to be consistent across all endpoints.
 *
 * AGENTS.md mandates:
 *   Success: { success: true,  data: {...}, message: "..." }
 *   Error:   { success: false, error: "CODE", message: "...", details: [...] }
 */

// ---------------------------------------------------------------------------
// Success helpers
// ---------------------------------------------------------------------------

/**
 * Send a 200 OK response.
 * Use for GET requests and PUT/PATCH updates.
 */
export const sendOk = <T>(res: Response, data: T, message = 'Success'): void => {
  const body: ApiSuccessResponse<T> = { success: true, message, data };
  res.status(200).json(body);
};

/**
 * Send a 201 Created response.
 * Use for POST requests that create a new resource.
 */
export const sendCreated = <T>(res: Response, data: T, message = 'Resource created'): void => {
  const body: ApiSuccessResponse<T> = { success: true, message, data };
  res.status(201).json(body);
};

/**
 * Send a 204 No Content response.
 * Use for DELETE requests. Express automatically omits the body.
 */
export const sendNoContent = (res: Response): void => {
  res.status(204).send();
};

// ---------------------------------------------------------------------------
// Error helpers
// ---------------------------------------------------------------------------

/**
 * Send an error response with the correct HTTP status code.
 * Prefer throwing AppError in the service layer and letting the global
 * error handler call this; use directly only in middleware.
 */
export const sendError = (
  res: Response,
  statusCode: number,
  errorCode: string,
  message: string,
  details: string[] = [],
): void => {
  const body: ApiErrorResponse = {
    success: false,
    error: errorCode,
    message,
    ...(details.length > 0 && { details }),
  };
  res.status(statusCode).json(body);
};
