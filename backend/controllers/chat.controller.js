import { ChatSession } from "../models/chatSession.model.js";
import { Message } from "../models/message.model.js";
import { invokeText, invokeJSON, SYSTEM_PROMPTS } from "../services/groq.service.js";
import { debugCode, formatCode, testAPI } from "../services/prompt.service.js";

export async function createChatSession(req, res) {
  try {
    const userId = req.user.id;
    const { title, firstMessage } = req.body;
    const page = req.query.page || "learn";

    // Use provided title, or first message (truncated), or default
    let sessionTitle = title;
    if (!sessionTitle && firstMessage) {
      sessionTitle = firstMessage.length > 50 ? firstMessage.substring(0, 50) + "..." : firstMessage;
    } else if (!sessionTitle) {
      sessionTitle = "New Chat";
    }

    const chatSession = await ChatSession.create({ user: userId, title: sessionTitle, page, messages: [] });
    return res.status(201).json({ success: true, chatSession });
  } catch (e) {
    return res.status(500).json({ success: false, message: "error" });
  }
}

export async function getChatSessionsByPage(req, res) {
  try {
    const userId = req.user.id;
    const page = req.params.page;
    const chatSessions = await ChatSession.find({ user: userId, page })
      .populate("messages")
      .sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, chatSessions });
  } catch (e) {
    console.error("Error getting chat sessions:", e);
    return res.status(500).json({ success: false, message: "error" });
  }
}

export async function getChatSessionById(req, res) {
  try {
    const sessionId = req.params.id;
    const userId = req.user.id;
    const session = await ChatSession.findOne({ _id: sessionId, user: userId })
      .populate({
        path: "messages",
        options: { sort: { createdAt: 1 } }
      });

    if (!session) {
      return res.status(404).json({ success: false, message: "Chat session not found" });
    }

    return res.status(200).json({ success: true, chatSession: session });
  } catch (e) {
    console.error("Error getting chat session:", e);
    return res.status(500).json({ success: false, message: "error" });
  }
}

export async function sendMessage(req, res) {
  try {
    const sessionId = req.params.id;
    const { content, toolData } = req.body; // toolData for tool-specific parameters
    const session = await ChatSession.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: "not found" });

    // Check if user owns this session
    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const userMessage = await Message.create({ chatSession: sessionId, role: "user", content });
    session.messages.push(userMessage._id);
    await session.save();

    // Get appropriate system prompt based on page/tool
    let aiText;
    const page = session.page;

    switch (page) {
      case "learn":
        const learnJson = await invokeJSON(SYSTEM_PROMPTS.learn, content);
        aiText = JSON.stringify(learnJson);
        break;
      case "review":
        aiText = await invokeText(SYSTEM_PROMPTS.review, content);
        break;
      case "explain":
        aiText = await invokeText(SYSTEM_PROMPTS.explain, content);
        break;
      case "roadmap":
        aiText = await invokeText(SYSTEM_PROMPTS.roadmap, content);
        break;
      case "debugger":
        aiText = await debugCode({
          code: content,
          language: toolData?.language || "javascript",
          errorMessage: toolData?.errorMessage,
          context: toolData?.context
        });
        break;
      case "formatter":
        aiText = await formatCode({
          code: content,
          language: toolData?.language || "javascript",
          styleGuide: toolData?.styleGuide
        });
        break;
      case "api-tester":
        aiText = await testAPI({
          endpoint: content,
          method: toolData?.method || "GET",
          headers: toolData?.headers,
          body: toolData?.body,
          expectedResponse: toolData?.expectedResponse
        });
        break;
      default:
        aiText = await invokeText("You are a helpful assistant.", content);
    }

    // Extract content and usage from result
    const aiContent = typeof aiText === 'object' && aiText.usage ? aiText.content : aiText;
    const usage = typeof aiText === 'object' && aiText.usage ? aiText.usage : { total_tokens: 0 };

    // Update user token usage
    // We update asynchronously to not block the response
    if (usage.total_tokens > 0) {
      try {
        const User = (await import("../models/user.model.js")).User;
        await User.findByIdAndUpdate(req.user.id, {
          $inc: { dailyTokenUsage: usage.total_tokens }
        });
      } catch (err) {
        console.error("Failed to update token usage:", err);
      }
    }

    // Ensure aiContent is a string for storage if it's an object (JSON response)
    const storedContent = typeof aiContent === 'object' ? JSON.stringify(aiContent) : aiContent;

    const aiMessage = await Message.create({ chatSession: sessionId, role: "ai", content: storedContent });
    session.messages.push(aiMessage._id);
    await session.save();

    const chatMessages = [userMessage, aiMessage];
    return res.status(200).json({ success: true, chatMessages, message: "message sent successfully" });
  } catch (e) {
    console.error("Error sending message:", e);
    return res.status(500).json({ success: false, message: "error" });
  }
}

export async function deleteChatSession(req, res) {
  try {
    const sessionId = req.params.id;
    const userId = req.user.id;
    const session = await ChatSession.findOne({ _id: sessionId, user: userId });
    if (!session) {
      return res.status(404).json({ success: false, message: "Chat session not found" });
    }
    await Message.deleteMany({ chatSession: sessionId });
    await ChatSession.findByIdAndDelete(sessionId);
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error("Error deleting chat session:", e);
    return res.status(500).json({ success: false, message: "error" });
  }
}
