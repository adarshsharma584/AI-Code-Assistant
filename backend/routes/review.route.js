import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createReviewSession, getReviewSessions, getReviewSession, submitForReview } from "../controllers/review.controller.js";

const router = Router();
router.use(authMiddleware);
router.post("/sessions", createReviewSession);
router.get("/sessions", getReviewSessions);
router.get("/sessions/:id", getReviewSession);
router.post("/submit", submitForReview);
export default router;
