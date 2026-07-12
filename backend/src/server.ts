/**
 * server.ts — HTTP server entry point.
 *
 * Responsibilities:
 *   1. Load environment variables (dotenv) before anything else.
 *   2. Import env config (triggers Zod validation — process.exit if invalid).
 *   3. Create the Express app.
 *   4. Start listening on the configured port.
 *   5. Register process-level signal handlers for graceful shutdown.
 *
 * This file is intentionally thin. All application configuration lives in
 * app.ts so it remains testable in isolation via createApp().
 */

// dotenv MUST be loaded before any other import that reads process.env.
import 'dotenv/config';

import http from 'http';
import { env } from './config/env';
import { createApp } from './app';

const app = createApp();
const server = http.createServer(app);

server.listen(env.PORT, () => {
  console.warn(`[TransitOps] 🚀 Server running on http://localhost:${env.PORT}`);
  console.warn(`[TransitOps] 🌍 Environment: ${env.NODE_ENV}`);
  console.warn(`[TransitOps] ✅ Health check: http://localhost:${env.PORT}/api/health`);
});

// ------------------------------------------------------------------
// Graceful shutdown — ensures in-flight requests complete before exit.
// Required for zero-downtime deployments in production (e.g., PM2 signals).
// ------------------------------------------------------------------

const shutdown = (signal: string): void => {
  console.warn(`\n[TransitOps] ${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.warn('[TransitOps] HTTP server closed. Goodbye.');
    process.exit(0);
  });

  // Force exit if server hasn't closed within 10 seconds
  setTimeout(() => {
    console.error('[TransitOps] Forced exit after timeout.');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Catch unhandled promise rejections — log and exit so the process manager restarts cleanly
process.on('unhandledRejection', (reason: unknown) => {
  console.error('[TransitOps] Unhandled promise rejection:', reason);
  process.exit(1);
});

// Catch uncaught synchronous exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('[TransitOps] Uncaught exception:', error);
  process.exit(1);
});

export default server;
