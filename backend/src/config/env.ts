import { z } from 'zod';

/**
 * env.ts — Environment variable validation.
 *
 * Validates ALL required environment variables at server startup using Zod.
 * If any variable is missing or malformed the server WILL NOT start and
 * a clear, human-readable error is printed — preventing cryptic runtime
 * failures deep inside a request handler.
 *
 * Pattern:
 *   1. Define the Zod schema (envSchema).
 *   2. Parse process.env through it.
 *   3. Export the typed `env` object — never use process.env directly elsewhere.
 *
 * Adding a new env variable:
 *   1. Add it to envSchema.
 *   2. Add it to backend/.env.example with a comment.
 *   3. That's it — the server validates it on next start.
 */

const envSchema = z.object({
  // ---- Server ----
  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0 && val < 65536, {
      message: 'PORT must be a valid port number (1-65535)',
    }),

  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // ---- Auth ----
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // ---- Gemini ----
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),

  // ---- CORS ----
  FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL'),

  // ---- Database (optional until DB branch merges) ----
  DATABASE_URL: z.string().optional(),

  // ---- SMTP ----
  SMTP_USER: z.string().email('SMTP_USER must be a valid email address'),
  SMTP_PASS: z.string().min(1, 'SMTP_PASS is required'),

  // ---- Bcrypt ----
  BCRYPT_ROUNDS: z
    .string()
    .default('12')
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 10 && val <= 14, {
      message: 'BCRYPT_ROUNDS must be between 10 and 14',
    }),

  // ---- Logging ----
  LOG_FORMAT: z.enum(['combined', 'common', 'dev', 'short', 'tiny']).default('dev'),
});

// Infer the typed shape for consumers
export type Env = z.infer<typeof envSchema>;

/**
 * Validates process.env against envSchema.
 * Throws with a descriptive message listing every failed field if invalid.
 */
function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.errors
      .map((err) => `  • ${err.path.join('.')}: ${err.message}`)
      .join('\n');

    console.error('\n❌  Environment variable validation failed:\n');
    console.error(formatted);
    console.error(
      '\n   Copy backend/.env.example to backend/.env and fill in the required values.\n',
    );
    process.exit(1);
  }

  return result.data;
}

/**
 * Validated, typed environment configuration.
 * Import and use `env` everywhere instead of `process.env.*` directly.
 *
 * @example
 * import { env } from '@/config/env';
 * const port = env.PORT;
 */
export const env: Env = validateEnv();
