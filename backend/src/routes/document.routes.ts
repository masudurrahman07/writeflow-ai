import { Router } from "express";
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from "../controllers/document.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", verifyToken, getDocuments);
router.post("/", verifyToken, createDocument);
router.patch("/:id", verifyToken, updateDocument);
router.delete("/:id", verifyToken, deleteDocument);

export default router;
