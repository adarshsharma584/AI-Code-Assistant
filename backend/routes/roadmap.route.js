import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createRoadmapSession, getRoadmapSessions, generateRoadmapHandler, deleteRoadmapSession } from "../controllers/roadmap.controller.js";

const router = Router();
router.use(authMiddleware);
router.post("/sessions", createRoadmapSession);
router.get("/sessions", getRoadmapSessions);
router.post("/generate", generateRoadmapHandler);
router.delete("/sessions/:id", deleteRoadmapSession);
export default router;
