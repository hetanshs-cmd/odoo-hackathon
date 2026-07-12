import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import apiRouter from './routes/index';

/**
 * createApp — Express application factory.
 *
 * Returns a fully configured Express app without starting the HTTP server.
 * Separating app creation from server.listen() enables clean testing:
 * tests import createApp() and pass it directly to supertest without
 * binding a real port.
 *
 * Middleware registration order is intentional and MUST NOT be changed:
 *   1. Security (Helmet) — before everything else
 *   2. CORS — before request parsing (preflight OPTIONS)
 *   3. Body parsing — before routes
 *   4. Request logging — before routes (captures all requests)
 *   5. Routes
 *   6. 404 handler — after all routes, before error handler
 *   7. Error handler — MUST be last (4-argument signature)
 */
export function createApp(): Application {
  const app = express();

  // ------------------------------------------------------------------
  // 1. Security headers (Helmet)
  //    Sets X-Content-Type-Options, X-Frame-Options, HSTS, CSP, etc.
  // ------------------------------------------------------------------
  app.use(helmet());

  // ------------------------------------------------------------------
  // 2. CORS
  //    Whitelist only the origin(s) in FRONTEND_URL.
  //    Supports comma-separated list for multi-origin configurations.
  // ------------------------------------------------------------------
  const allowedOrigins = env.FRONTEND_URL.split(',').map((origin) => origin.trim());

  app.use(
    cors({
      origin: (requestOrigin, callback) => {
        // Allow requests with no origin (e.g., curl, Postman, mobile apps)
        if (!requestOrigin) {
          callback(null, true);
          return;
        }
        if (allowedOrigins.includes(requestOrigin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: origin '${requestOrigin}' is not allowed`));
        }
      },
      credentials: true, // Required for httpOnly cookie refresh tokens
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // ------------------------------------------------------------------
  // 3. JSON body parsing
  //    Limit set to 10mb — tune per feature if needed.
  //    Malformed JSON is caught by the error handler as SyntaxError.
  // ------------------------------------------------------------------
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ------------------------------------------------------------------
  // 4. HTTP request logging (Morgan)
  // ------------------------------------------------------------------
  app.use(requestLogger);

  // ------------------------------------------------------------------
  // 5. API routes — all feature routes mounted at /api
  // ------------------------------------------------------------------
  app.use('/api', apiRouter);

  // ------------------------------------------------------------------
  // 6. 404 handler — catches any route not matched above
  // ------------------------------------------------------------------
  app.use(notFound);

  // ------------------------------------------------------------------
  // 7. Global error handler — MUST be the last middleware registered
  //    (Express identifies it by the 4-argument (err, req, res, next) signature)
  // ------------------------------------------------------------------
  app.use(errorHandler);

  return app;
}
