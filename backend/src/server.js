import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { disconnectPrisma } from "./lib/prisma.js";

let shuttingDown = false;

const server = app.listen(env.PORT, () => {
  logger.info(
    { port: env.PORT, env: env.NODE_ENV },
    `Mathematics Backend started`,
  );
});

// ── Graceful shutdown ───────────────────────
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;

  logger.info({ signal }, "Shutdown signal received");

  // Bounded shutdown timeout
  const timeout = setTimeout(() => {
    logger.warn("Shutdown timeout reached, forcing exit");
    process.exit(1);
  }, 10_000);

  try {
    // Stop accepting new requests and await closure
    await new Promise((resolve) => {
      server.close(() => {
        logger.info("HTTP server closed");
        resolve();
      });
    });

    // Disconnect Prisma
    await disconnectPrisma();
    logger.info("Prisma disconnected");

    clearTimeout(timeout);
    logger.info("Graceful shutdown complete");
    process.exit(0);
  } catch (err) {
    logger.error({ err }, "Shutdown error");
    clearTimeout(timeout);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
