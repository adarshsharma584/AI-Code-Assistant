import { Router } from "express";
import { getCurrentUser, getUserAnalytics } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
router.get("/me", authMiddleware, getCurrentUser);
router.get("/analytics", authMiddleware, getUserAnalytics);

export default router;
