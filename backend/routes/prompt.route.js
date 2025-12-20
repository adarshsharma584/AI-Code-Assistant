import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { learningMaterial, explainCode } from "../controllers/prompt.controller.js";

const router = Router();
router.use(authMiddleware);
router.post("/learning-material", learningMaterial);
router.post("/explain-code", explainCode);

export default router;
