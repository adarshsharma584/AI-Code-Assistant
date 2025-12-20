import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createChatSession, getChatSessionsByPage, getChatSessionById, sendMessage, deleteChatSession } from "../controllers/chat.controller.js";

const router = Router();
router.use(authMiddleware);
router.post("/", createChatSession);
router.get("/page/:page", getChatSessionsByPage);
router.get("/:id", getChatSessionById);
router.post("/:id/messages", sendMessage);
router.delete("/:id", deleteChatSession);
export default router;
