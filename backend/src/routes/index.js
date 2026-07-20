import { Router } from "express";
import { healthRoutes } from "../modules/health/index.js";

const router = Router();

// ── API v1 ──────────────────────────────────
router.use("/api/v1", healthRoutes);

export { router as apiRoutes };
