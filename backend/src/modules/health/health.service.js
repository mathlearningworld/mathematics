/**
 * Health check service.
 * Returns service status without requiring a database connection.
 */
export const healthService = {
  check() {
    return {
      status: "ok",
      service: "mathematics-backend",
    };
  },
};
