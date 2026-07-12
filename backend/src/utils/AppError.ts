import { ErrorCode } from '../types/common';

/**
 * AppError — typed, operational error thrown anywhere in the service layer.
 *
 * The global error handler (middleware/errorHandler.ts) catches every AppError
 * and converts it to the correct HTTP status + JSON envelope automatically.
 * Services MUST throw AppError instead of raw Error so the client always
 * receives a coded, human-readable message and never a stack trace.
 *
 * Usage:
 *   throw new AppError('NOT_FOUND', 404, 'Vehicle not found');
 *   throw new AppError('VALIDATION_ERROR', 400, 'Invalid input', ['name is required']);
 */
export class AppError extends Error {
  /** Machine-readable error code — appears in the `error` field of the response envelope. */
  public readonly code: ErrorCode;

  /** HTTP status code to send. */
  public readonly statusCode: number;

  /**
   * isOperational = true  → expected business/validation error, safe to expose message.
   * isOperational = false → programming error (Bug), log and return generic 500.
   */
  public readonly isOperational: boolean;

  /** Optional array of field-level validation messages. */
  public readonly details: string[];

  constructor(
    code: ErrorCode,
    statusCode: number,
    message: string,
    details: string[] = [],
    isOperational = true,
  ) {
    super(message);

    // Restore prototype chain so `instanceof AppError` works after transpilation.
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    // Capture clean stack trace (V8-specific — safe to omit on other runtimes).
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
