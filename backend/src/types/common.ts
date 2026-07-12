/**
 * Shared TypeScript types used across all layers of the TransitOps API.
 *
 * Rules:
 * - Only pure types and interfaces here — no runtime code.
 * - DB-specific types (column shapes, Prisma types) live in modules once
 *   the database branch is merged.
 */

// ---------------------------------------------------------------------------
// API Response envelope
// ---------------------------------------------------------------------------

/** Shape of every successful API response body. */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

/** Shape of every error API response body. */
export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: string[];
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

/** Standard pagination query parameters (used by list endpoints). */
export interface PaginationQuery {
  page: number;
  limit: number;
}

/** Paginated list result wrapper. */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---------------------------------------------------------------------------
// Auth context — available on req.user after JWT middleware authenticates
// ---------------------------------------------------------------------------

/**
 * Payload decoded from a valid access JWT.
 * Field names will align with the users table once the DB branch is merged.
 */
export interface AuthenticatedUser {
  id: number;
  email: string;
  role: string | null;
  driverId?: number; // Added for row-level ownership checks where applicable
}

/**
 * RBAC roles for TransitOps (based on API specification).
 */
export type UserRole = 'FleetManager' | 'Driver' | 'SafetyOfficer' | 'FinancialAnalyst';

// ---------------------------------------------------------------------------
// Error codes — must match the error envelope's `error` field
// ---------------------------------------------------------------------------

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_AUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_ALREADY_EXISTS'
  | 'UNPROCESSABLE_ENTITY'
  | 'NOT_IMPLEMENTED'
  | 'INTERNAL_SERVER_ERROR';
