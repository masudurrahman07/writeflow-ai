import { Router } from "express";
import { register, login, refreshToken, getMe } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

export default router;
