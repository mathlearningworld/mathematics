import express from "express";
import { apiRoutes } from "./routes/index.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// ── Middleware ───────────────────────────────
app.use(express.json());

// ── Routes ──────────────────────────────────
app.use(apiRoutes);

// ── 404 handler (after routes, before error handler) ──
app.use(notFoundHandler);

// ── Error handling ──────────────────────────
app.use(errorHandler);

export { app };
