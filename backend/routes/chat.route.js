import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createChatSession, getChatSessionsByPage, sendMessage, deleteChatSession } from "../controllers/chat.controller.js";

const router = Router();
router.use(authMiddleware);
router.post("/", createChatSession);
router.get("/page/:page", getChatSessionsByPage);
router.post("/:id/messages", sendMessage);
router.delete("/:id", deleteChatSession);
export default router;
