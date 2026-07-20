import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    const formatted = result.error.flatten();
    for (const [key, messages] of Object.entries(formatted.fieldErrors)) {
      console.error(`  ${key}: ${messages.join(", ")}`);
    }
    throw new Error("Environment validation failed");
  }

  return result.data;
}

export const env = validateEnv();
