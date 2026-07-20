import { healthService } from "./health.service.js";

/**
 * GET /api/v1/health
 * Returns the current service health status.
 * Does not require a database connection.
 */
export function getHealth(_req, res, next) {
  try {
    const status = healthService.check();
    res.status(200).json(status);
  } catch (err) {
    next(err);
  }
}
