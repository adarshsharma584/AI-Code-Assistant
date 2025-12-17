import { ChatSession } from "../models/chatSession.model.js";
import { Message } from "../models/message.model.js";
import { generateContent } from "../services/gemini.service.js";

export async function createChatSession(req, res) {
  try {
    const userId = req.user.id;
    const { title } = req.body;
    const page = req.query.page || "learn";
    const chatSession = await ChatSession.create({ user: userId, title, page, messages: [] });
    return res.status(201).json({ success: true, chatSession });
  } catch (e) {
    return res.status(500).json({ success: false, message: "error" });
  }
}

export async function getChatSessionsByPage(req, res) {
  try {
    const userId = req.user.id;
    const page = req.params.page;
    const chatSessions = await ChatSession.find({ user: userId, page }).sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, chatSessions });
  } catch (e) {
    return res.status(500).json({ success: false, message: "error" });
  }
}

export async function sendMessage(req, res) {
  try {
    const sessionId = req.params.id;
    const { content } = req.body;
    const session = await ChatSession.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: "not found" });
    const userMessage = await Message.create({ chatSession: sessionId, role: "user", content });
    session.messages.push(userMessage._id);
    await session.save();
    const aiText = await generateContent(content, "You are a helpful assistant.");
    const aiMessage = await Message.create({ chatSession: sessionId, role: "ai", content: aiText });
    session.messages.push(aiMessage._id);
    await session.save();
    const chatMessages = [userMessage, aiMessage];
    return res.status(200).json({ success: true, chatMessages, message: "message sent successfully" });
  } catch (e) {
    return res.status(500).json({ success: false, message: "error" });
  }
}

export async function deleteChatSession(req, res) {
  try {
    const sessionId = req.params.id;
    await Message.deleteMany({ chatSession: sessionId });
    await ChatSession.findByIdAndDelete(sessionId);
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ success: false, message: "error" });
  }
}
