import { logger } from "../lib/logger.js";

/**
 * Global error-handling middleware.
 * Catches all errors thrown or passed via next(err).
 *
 * Message-selection precedence:
 *   1. If the error has an explicit `expose` flag, use err.message.
 *   2. If statusCode < 500 (client error), use err.message.
 *   3. Otherwise (server error), use a generic message.
 */
export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  let message;
  let code;

  if (err.expose || statusCode < 500) {
    message = err.message;
    code = err.code || "ERROR";
  } else {
    message = "Internal Server Error";
    code = "INTERNAL_SERVER_ERROR";
  }

  if (statusCode >= 500) {
    logger.error({ err }, "Unhandled error");
  }

  const body = {
    error: {
      code,
      message,
    },
  };

  if (process.env.NODE_ENV === "development" && err.stack) {
    body.error.stack = err.stack;
  }

  res.status(statusCode).json(body);
}
