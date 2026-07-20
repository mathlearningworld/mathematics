import { PrismaClient } from "@prisma/client";
import { env } from "../config/env.js";
import { logger } from "./logger.js";

export const prisma = new PrismaClient({
  log:
    env.NODE_ENV === "development"
      ? ["query", "warn", "error"]
      : ["warn", "error"],
});

prisma.$on("error", (e) => {
  logger.error(e, "Prisma error");
});

/**
 * Gracefully disconnect Prisma on shutdown.
 */
export async function disconnectPrisma() {
  await prisma.$disconnect();
  logger.info("Prisma disconnected");
}
