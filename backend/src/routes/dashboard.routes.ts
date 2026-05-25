import { Router } from "express";
import { getStats, getChartData } from "../controllers/dashboard.controller";
import { verifyToken, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/stats", verifyToken, requireAdmin, getStats);
router.get("/chart-data", verifyToken, requireAdmin, getChartData);

export default router;
