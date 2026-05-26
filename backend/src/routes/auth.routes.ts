import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  getMe,
  googleLogin,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/refresh-token", refreshToken);
router.get("/me", protect, getMe);

export default router;
