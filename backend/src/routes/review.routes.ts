import { Router } from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReviewsByItem,
} from "../controllers/review.controller";
import { protect, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/item/:itemId", getReviewsByItem);
router.post("/", protect, createReview);
router.get("/", protect, requireAdmin, getAllReviews);
router.delete("/:id", protect, requireAdmin, deleteReview);

export default router;
