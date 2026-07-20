/**
 * 404 handler for unknown API routes.
 * Returns a JSON response instead of the default HTML.
 */
export function notFoundHandler(_req, res) {
  res.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "Route not found",
    },
  });
}
