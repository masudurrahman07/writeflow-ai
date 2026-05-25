import { Router } from "express";
import {
  getUserById,
  updateUser,
  getUsers,
  updateUserRole,
  toggleUserBanned,
} from "../controllers/user.controller";
import { verifyToken, requireAdmin, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// Admin-only routes
router.get("/", verifyToken, requireAdmin, getUsers);
router.patch("/role", verifyToken, requireAdmin, updateUserRole);

// Single route for patch user
router.patch("/:id", verifyToken, (req: AuthRequest, res, next) => {
  const { id } = req.params;
  // If editing another user, require admin role to toggle banned status
  if (id !== req.userId) {
    return requireAdmin(req, res, () => toggleUserBanned(req, res, next));
  }
  // Otherwise, updating own profile
  return updateUser(req, res, next);
});

router.get("/:id", verifyToken, getUserById);

export default router;
