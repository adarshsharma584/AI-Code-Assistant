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

    const materialContent = await generateLearningMaterial({ title, topic, level });

    // Estimate tokens for now since generateLearningMaterial might not return usage yet
    // In a real scenario, we'd want generateLearningMaterial to return usage
    // For now, let's estimate based on content length (approx 4 chars per token)
    const estimatedTokens = typeof materialContent === 'string' ? materialContent.length / 4 : JSON.stringify(materialContent).length / 4;

    if (estimatedTokens > 0) {
      try {
        const User = (await import("../models/user.model.js")).User;
        await User.findByIdAndUpdate(req.user.id, {
          $inc: { dailyTokenUsage: Math.round(estimatedTokens) }
        });
      } catch (err) {
        console.error("Failed to update token usage:", err);
      }
    }

    const userMsg = await Message.create({ chatSession: session._id, role: "user", content: `${title} ${topic} ${level}` });
    const aiMsg = await Message.create({
      chatSession: session._id,
      role: "ai",
      content: typeof materialContent === 'string' ? materialContent : JSON.stringify(materialContent)
    });
    session.messages.push(userMsg._id, aiMsg._id);
    await session.save();
    return res.status(200).json({ success: true, data: { material: { content: materialContent }, sessionId: session._id } });
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

    const result = await generateCodeExplanation({ code, language });
    const explanationContent = result.content;
    const usage = result.usage;

    if (usage && usage.total_tokens > 0) {
      try {
        const User = (await import("../models/user.model.js")).User;
        await User.findByIdAndUpdate(req.user.id, {
          $inc: { dailyTokenUsage: usage.total_tokens }
        });
      } catch (err) {
        console.error("Failed to update token usage:", err);
      }
    }

    const userMsg = await Message.create({ chatSession: session._id, role: "user", content: code });
    const aiMsg = await Message.create({ chatSession: session._id, role: "ai", content: explanationContent });
    session.messages.push(userMsg._id, aiMsg._id);
    await session.save();
    return res.status(200).json({ success: true, data: { explanation: explanationContent, sessionId: session._id } });
  } catch (e) {
    console.error("Error explaining code:", e);
    return res.status(500).json({ success: false, message: "error" });
  }
}

