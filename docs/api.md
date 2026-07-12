# API Reference — Odoo Hackathon

Base URL: `http://localhost:5000/api/v1`

All responses follow this envelope:
```json
// Success
{ "success": true, "data": { ... }, "message": "Human readable description" }

// Error
{ "success": false, "error": "ERROR_CODE", "message": "Human readable description", "details": [...] }
```

Authentication: Pass `Authorization: Bearer <access_token>` header on protected routes.

---

## Authentication

### POST /auth/register
Register a new user. Returns a temporary ID for OTP verification.

**Request Body**
```json
{
  "name": "string (2-100 chars, required)",
  "email": "string (valid email, required)",
  "password": "string (8+ chars, required)"
}
```

**Responses**
| Status | Code | Description |
|--------|------|-------------|
| 201 | — | User created. Returns `{ tempId }` |
| 400 | `VALIDATION_ERROR` | Missing or invalid fields |
| 409 | `EMAIL_ALREADY_EXISTS` | Email is already registered |

---

### POST /auth/register/verify
Verify a new user's email with an OTP.

**Request Body**
```json
{
  "email": "string (required)",
  "otp": "string (6 chars, required)"
}
```

**Responses**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | Email verified. Returns success message. |
| 400 | `VALIDATION_ERROR` | Invalid or expired OTP |
| 400 | `CONFLICT` | Email already verified |

---

### POST /auth/login
Authenticate an existing user.

**Request Body**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Responses**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | Login successful. Returns `{ requireOtp: false, token: "...", user: {...} }` |
| 400 | `VALIDATION_ERROR` | Missing fields |
| 401 | `INVALID_CREDENTIALS` | Wrong email or password |
| 403 | `FORBIDDEN` | Unverified email or inactive account |

---

### POST /auth/forgot-password
Request a password reset OTP.

**Request Body**
```json
{
  "email": "string (required)"
}
```

**Responses**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | Always returns success (prevents email enumeration). |

---

### POST /auth/reset-password
Reset password using an OTP.

**Request Body**
```json
{
  "email": "string (required)",
  "otp": "string (6 chars, required)",
  "newPassword": "string (8+ chars, required)"
}
```

**Responses**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | Password reset successful. |
| 400 | `VALIDATION_ERROR` | Invalid or expired OTP |
| 400 | `FORBIDDEN` | Too many failed attempts |

---

### POST /auth/logout
Invalidate the current session.

**Auth**: Required

**Responses**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | Logged out successfully |

## Users

### GET /users/me
Get the currently authenticated user's profile.

**Auth**: Required

**Responses**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | Returns `{ user }` |
| 401 | `NOT_AUTHENTICATED` | No valid token |

---

<!-- Additional endpoints will be documented here as features are implemented -->

---

## Error Reference

| Code | Meaning |
|------|---------|
| `VALIDATION_ERROR` | One or more request fields failed validation. See `details` array. |
| `INVALID_CREDENTIALS` | Email/password combination is incorrect. |
| `EMAIL_ALREADY_EXISTS` | The provided email is already registered. |
| `NOT_AUTHENTICATED` | Request requires authentication. |
| `FORBIDDEN` | Authenticated user lacks permission for this action. |
| `NOT_FOUND` | The requested resource does not exist. |
| `CONFLICT` | The action would cause a duplicate or conflicting state. |
| `INTERNAL_SERVER_ERROR` | Unexpected server error. Check server logs. |
