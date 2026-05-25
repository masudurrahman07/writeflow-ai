import { Router } from "express";
import {
  generateContent,
  rewriteContent,
  chatWithAI,
  getAIHistory,
} from "../controllers/ai.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/history", verifyToken, getAIHistory);
router.post("/generate-content", verifyToken, generateContent);
router.post("/rewrite", verifyToken, rewriteContent);
router.post("/chat", verifyToken, chatWithAI);

export default router;
