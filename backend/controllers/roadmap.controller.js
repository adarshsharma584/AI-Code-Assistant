import { ChatSession } from "../models/chatSession.model.js";
import { Message } from "../models/message.model.js";
import { generateRoadmap } from "../services/prompt.service.js";

export async function createRoadmapSession(req, res) {
  try {
    const { title } = req.body;
    const session = await ChatSession.create({ user: req.user.id, title: title || "Roadmap", page: "roadmap" });
    return res.status(201).json({ success: true, roadmapSession: session });
  } catch (e) {
    return res.status(500).json({ success: false, message: "error" });
  }
}

export async function getRoadmapSessions(req, res) {
  try {
    const sessions = await ChatSession.find({ user: req.user.id, page: "roadmap" }).sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, roadmapSessions: sessions });
  } catch (e) {
    return res.status(500).json({ success: false, message: "error" });
  }
}

export async function generateRoadmapHandler(req, res) {
  try {
    const { goal, currentSkills, timeframe, sessionId } = req.body;
    let session = sessionId ? await ChatSession.findById(sessionId) : null;
    if (!session) session = await ChatSession.create({ user: req.user.id, title: `Roadmap: ${goal}`, page: "roadmap" });
    const roadmap = await generateRoadmap({ goal, currentSkills, timeframe });
    const userMsg = await Message.create({ chatSession: session._id, role: "user", content: goal });
    const aiMsg = await Message.create({ chatSession: session._id, role: "ai", content: roadmap });
    session.messages.push(userMsg._id, aiMsg._id);
    await session.save();
    return res.status(200).json({ success: true, roadmap, sessionId: session._id });
  } catch (e) {
    return res.status(500).json({ success: false, message: "error" });
  }
}
