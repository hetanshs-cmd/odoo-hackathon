import morgan from 'morgan';
import { env } from '../config/env';

/**
 * requestLogger — HTTP request logger middleware using Morgan.
 *
 * The log format is controlled by the LOG_FORMAT environment variable:
 *   dev      → colorized concise output (recommended for development)
 *   combined → Apache combined log format (recommended for production)
 *
 * Morgan is only responsible for request/response logging.
 * Application-level errors are logged by the global error handler.
 */
export const requestLogger = morgan(env.LOG_FORMAT);
