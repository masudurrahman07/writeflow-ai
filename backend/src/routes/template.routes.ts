import { Router } from "express";
import {
  getAllTemplates,
  getRelatedTemplates,
  getTemplateById,
} from "../controllers/template.controller";

const router = Router();

router.get("/", getAllTemplates);
router.get("/:id/related", getRelatedTemplates);
router.get("/:id", getTemplateById);

export default router;
