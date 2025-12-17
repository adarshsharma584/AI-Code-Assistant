import { ChatSession } from "../models/chatSession.model.js";
import { Message } from "../models/message.model.js";
import { generateLearningMaterial, generateCodeExplanation } from "../services/prompt.service.js";

export async function learningMaterial(req, res) {
  try {
    const { title, topic, level, chatSessionId } = req.body;
    let session = chatSessionId ? await ChatSession.findById(chatSessionId) : null;
    if (!session) {
      session = await ChatSession.create({ user: req.user.id, title: title || topic || "Learning", page: "learn" });
    }
    const content = await generateLearningMaterial({ title, topic, level });
    const userMsg = await Message.create({ chatSession: session._id, role: "user", content: `${title} ${topic} ${level}` });
    const aiMsg = await Message.create({ chatSession: session._id, role: "ai", content });
    session.messages.push(userMsg._id, aiMsg._id);
    await session.save();
    return res.status(200).json({ success: true, material: { content }, sessionId: session._id });
  } catch (e) {
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
    const explanation = await generateCodeExplanation({ code, language });
    const userMsg = await Message.create({ chatSession: session._id, role: "user", content: code });
    const aiMsg = await Message.create({ chatSession: session._id, role: "ai", content: explanation });
    session.messages.push(userMsg._id, aiMsg._id);
    await session.save();
    return res.status(200).json({ success: true, explanation, sessionId: session._id });
  } catch (e) {
    return res.status(500).json({ success: false, message: "error" });
  }
}
