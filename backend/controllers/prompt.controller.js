import { ChatSession } from "../models/chatSession.model.js";
import { Message } from "../models/message.model.js";
import { generateLearningMaterial, generateCodeExplanation } from "../services/prompt.service.js";
import { generateQuestions } from "../services/groq.service.js";

export async function learningMaterial(req, res) {
  try {
    const { title, topic, level, chatSessionId } = req.body;
    let session = chatSessionId ? await ChatSession.findById(chatSessionId) : null;
    if (!session) {
      session = await ChatSession.create({ user: req.user.id, title: title || topic || "Learning", page: "learn" });
    }

    // Check if user owns this session
    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const content = await generateLearningMaterial({ title, topic, level });
    const userMsg = await Message.create({ chatSession: session._id, role: "user", content: `${title} ${topic} ${level}` });
    const aiMsg = await Message.create({ chatSession: session._id, role: "ai", content });
    session.messages.push(userMsg._id, aiMsg._id);
    await session.save();
    return res.status(200).json({ success: true, data: { material: { content }, sessionId: session._id } });
  } catch (e) {
    console.error("Error generating learning material:", e);
    return res.status(500).json({ success: false, message: "error" });
  }
}

export async function explainCode(req, res) {
  try {
    const { code, language, chatSessionId } = req.body;
    let session = chatSessionId ? await ChatSession.findById(chatSessionId) : null;
    if (!session) {
      session = await ChatSession.create({ user: req.user.id, title: `Explain ${language}`, page: "explain" });
    }

    // Check if user owns this session
    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const explanation = await generateCodeExplanation({ code, language });
    const userMsg = await Message.create({ chatSession: session._id, role: "user", content: code });
    const aiMsg = await Message.create({ chatSession: session._id, role: "ai", content: explanation });
    session.messages.push(userMsg._id, aiMsg._id);
    await session.save();
    return res.status(200).json({ success: true, data: { explanation, sessionId: session._id } });
  } catch (e) {
    console.error("Error explaining code:", e);
    return res.status(500).json({ success: false, message: "error" });
  }
}

