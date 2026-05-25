import { Router } from "express";
import { getUserById, updateUser } from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/:id", verifyToken, getUserById);
router.patch("/:id", verifyToken, updateUser);

export default router;
