import express from "express";
import {
  createChatSession,
  getChatSessionsByPage,
  getChatSessionById,
  sendMessage,
  deleteChatSession,
} from "../controllers/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protect all chat routes with authentication
router.use(authMiddleware);

// Chat session routes
router.post("/", createChatSession);
router.get("/page/:page", getChatSessionsByPage);
router.get("/:id", getChatSessionById);
router.post("/:id/messages", sendMessage);
router.delete("/:id", deleteChatSession);

export const chatRouter = router;