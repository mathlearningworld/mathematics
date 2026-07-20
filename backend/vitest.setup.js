/**
 * Vitest setup file.
 * Sets explicit test-only environment values before app imports.
 * Does NOT read backend/.env — tests must pass on a clean checkout.
 */

process.env.NODE_ENV = "test";
process.env.PORT = "3001";
process.env.DATABASE_URL =
  "postgresql://test:test@127.0.0.1:5433/mathematics_test";
process.env.LOG_LEVEL = "error";
