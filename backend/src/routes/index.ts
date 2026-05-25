import { Router } from "express";
import authRoutes from "./auth.routes";

const router = Router();

router.use("/auth", authRoutes);

// Add more route groups here as the app grows:
// router.use("/projects", projectRoutes);
// router.use("/documents", documentRoutes);

export default router;
