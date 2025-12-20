import { ChatSession } from "../models/chatSession.model.js";
import { Message } from "../models/message.model.js";
import { generateCodeReview } from "../services/prompt.service.js";

export async function createReviewSession(req, res) {
  try {
    const { title } = req.body;
    const session = await ChatSession.create({ user: req.user.id, title: title || "Code Review", page: "review" });
    return res.status(201).json({ success: true, reviewSession: session });
  } catch (e) {
    return res.status(500).json({ success: false, message: "error" });
  }
}

export async function getReviewSessions(req, res) {
  try {
    const sessions = await ChatSession.find({ user: req.user.id, page: "review" })
      .populate("messages")
      .sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, reviewSessions: sessions });
  } catch (e) {
    console.error("Error getting review sessions:", e);
    return res.status(500).json({ success: false, message: "error" });
  }
}

export async function getReviewSession(req, res) {
  try {
    const session = await ChatSession.findOne({ _id: req.params.id, user: req.user.id })
      .populate({
        path: "messages",
        options: { sort: { createdAt: 1 } }
      });
    if (!session) return res.status(404).json({ success: false, message: "not found" });
    return res.status(200).json({ success: true, reviewSession: session });
  } catch (e) {
    console.error("Error getting review session:", e);
    return res.status(500).json({ success: false, message: "error" });
  }
}

export async function submitForReview(req, res) {
  try {
    const { code, language, context, sessionId } = req.body;
    let session = sessionId ? await ChatSession.findById(sessionId) : null;
    if (!session) session = await ChatSession.create({ user: req.user.id, title: "Code Review", page: "review" });

    // Check if user owns this session
    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const review = await generateCodeReview({ code, language, context });
    const userMsg = await Message.create({ chatSession: session._id, role: "user", content: code });
    const aiMsg = await Message.create({ chatSession: session._id, role: "ai", content: review });
    session.messages.push(userMsg._id, aiMsg._id);
    session.lastUpdated = new Date();
    await session.save();
    return res.status(200).json({ success: true, review, sessionId: session._id });
  } catch (e) {
    console.error("Error submitting for review:", e);
    return res.status(500).json({ success: false, message: "error" });
  }
}

export async function deleteReviewSession(req, res) {
  try {
    const sessionId = req.params.id;
    const session = await ChatSession.findOne({ _id: sessionId, user: req.user.id });
    if (!session) return res.status(404).json({ success: false, message: "not found" });

    await Message.deleteMany({ chatSession: sessionId });
    await ChatSession.findByIdAndDelete(sessionId);
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error("Error deleting review session:", e);
    return res.status(500).json({ success: false, message: "error" });
  }
}
