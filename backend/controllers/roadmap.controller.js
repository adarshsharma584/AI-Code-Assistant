import { ChatSession } from "../models/chatSession.model.js";
import { Message } from "../models/message.model.js";
import { generateRoadmap, generateRoadmapJSON } from "../services/prompt.service.js";

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
    const sessions = await ChatSession.find({ user: req.user.id, page: "roadmap" })
      .populate("messages")
      .sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, roadmapSessions: sessions });
  } catch (e) {
    console.error("Error getting roadmap sessions:", e);
    return res.status(500).json({ success: false, message: "error" });
  }
}

export async function getRoadmapSessionById(req, res) {
  try {
    const sessionId = req.params.id;
    const session = await ChatSession.findOne({ _id: sessionId, user: req.user.id })
      .populate({
        path: "messages",
        options: { sort: { createdAt: 1 } }
      });

    if (!session) {
      return res.status(404).json({ success: false, message: "Roadmap session not found" });
    }

    return res.status(200).json({ success: true, roadmapSession: session });
  } catch (e) {
    console.error("Error getting roadmap session:", e);
    return res.status(500).json({ success: false, message: "error" });
  }
}

export async function generateRoadmapHandler(req, res) {
  try {
    const { goal, currentSkills, timeframe, sessionId } = req.body;
    let session = sessionId ? await ChatSession.findById(sessionId) : null;
    if (!session) session = await ChatSession.create({ user: req.user.id, title: `Roadmap: ${goal}`, page: "roadmap" });

    // Check if user owns this session
    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    console.log(`Starting roadmap generation for goal: ${goal}`);

    let roadmapResult, roadmapDataResult;
    let roadmap, roadmapData;

    try {
      console.log("Generating markdown roadmap...");
      roadmapResult = await generateRoadmap({ goal, currentSkills, timeframe });
      roadmap = roadmapResult.content;
      console.log("Markdown roadmap generated successfully.");
    } catch (err) {
      console.error("Error generating markdown roadmap:", err);
      throw new Error(`Failed to generate markdown roadmap: ${err.message}`);
    }

    try {
      console.log("Generating JSON roadmap data...");
      roadmapDataResult = await generateRoadmapJSON({ goal, currentSkills, timeframe });
      roadmapData = roadmapDataResult.content;
      console.log("JSON roadmap data generated successfully.");
    } catch (err) {
      console.error("Error generating JSON roadmap data:", err);
      // Fallback: If JSON fails, we can still return the markdown if necessary, 
      // but for now we throw to see the error.
      throw new Error(`Failed to generate JSON roadmap: ${err.message}`);
    }

    const userMsg = await Message.create({ chatSession: session._id, role: "user", content: goal });
    const aiMsg = await Message.create({
      chatSession: session._id,
      role: "ai",
      content: typeof roadmap === 'string' ? roadmap : JSON.stringify(roadmap),
      metadata: { roadmapData }
    });

    session.messages.push(userMsg._id, aiMsg._id);
    await session.save();
    return res.status(200).json({ success: true, roadmap, roadmapData, sessionId: session._id });
  } catch (e) {
    console.error("Error generating roadmap:", e);
    return res.status(500).json({ success: false, message: e.message || "error" });
  }
}

export async function deleteRoadmapSession(req, res) {
  try {
    const sessionId = req.params.id;
    const session = await ChatSession.findOne({ _id: sessionId, user: req.user.id });
    if (!session) return res.status(404).json({ success: false, message: "not found" });

    await Message.deleteMany({ chatSession: sessionId });
    await ChatSession.findByIdAndDelete(sessionId);
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error("Error deleting roadmap session:", e);
    return res.status(500).json({ success: false, message: "error" });
  }
}
