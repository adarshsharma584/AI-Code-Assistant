import { ChatSession } from "../models/chatSession.model.js";
import { Message } from "../models/message.model.js";
import { generateChatResponse } from "../services/prompt.service.js";
import fs from "fs";
/**
 * Create a new chat session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createChatSession = async (req, res) => {
  try {
    const { title } = req.body;
    const {page}=req.query;
    const userId = req.user.id;
    console.log(title,page,userId);
    if (!title || !page) {
      return res.status(400).json({ message: "Title and page are required" });
    }

    // Validate page type
    const validPages = ["learn", "review", "explain", "roadmap"];
    if (!validPages.includes(page)) {
      return res.status(400).json({ 
        message: `Invalid page type. Must be one of: ${validPages.join(", ")}` 
      });
    }

    const chatSession = await ChatSession.create({
      user: userId,
      title,
      page,
      messages: [],
    });

    res.status(201).json({
      success: true,
      chatSession,
      message:"chat created successfully"
    });
  } catch (error) {
    console.error("Error creating chat session:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create chat session", 
      error: error.message 
    });
  }
};

/**
 * Get all chat sessions for a user by page type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getChatSessionsByPage = async (req, res) => {
  try {
    const { page } = req.params;
    const userId = req.user.id;
    console.log(page,userId)
    // Validate page type if provided
    if (page && page !== "all") {
      const validPages = ["learn", "review", "explain", "roadmap"];
      if (!validPages.includes(page)) {
        return res.status(400).json({ 
          message: `Invalid page type. Must be one of: ${validPages.join(", ")} or 'all'` 
        });
      }
    }

    // Build query based on whether page is specified or "all"
    const query = { user: userId };
    if (page && page !== "all") {
      query.page = page;
    }

    const chatSessions = await ChatSession.find(query)
      .sort({ lastUpdated: -1 })
      .select("title page lastUpdated")
      .lean();

    res.status(200).json({
      success: true,
      count: chatSessions.length,
      chatSessions,
      message:"chat sessions fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch chat sessions", 
      error: error.message 
    });
  }
};

/**
 * Get a chat session by ID with its messages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getChatSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const chatSession = await ChatSession.findById(id).lean();

    if (!chatSession) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    // Check if the chat session belongs to the user
    if (chatSession.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access to chat session" });
    }

    // Get messages for this chat session
    const messages = await Message.find({ chatSession: id })
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json({
      success: true,
      chatSession: {
        ...chatSession,
        messages,
      },
      message:"chat session fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching chat session:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch chat session", 
      error: error.message 
    });
  }
};

/**
 * Send a message in a chat session and get AI response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
// // controllers/chat.controller.js (only sendMessage)
const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const chatSession = await ChatSession.findById(id);
    if (!chatSession) return res.status(404).json({ message: "Chat session not found" });
    if (chatSession.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access to chat session" });
    }

    // 1) Save the user message
    const userMessage = await Message.create({
      chatSession: id,
      role: "user",          // ✅ matches schema enum ["user","ai"]
      content,
    });

    // Push the message ObjectId into the session
    chatSession.messages.push(userMessage._id);

    // 2) Build recent history (last 10) for context
    const recentMessages = await Message.find({ chatSession: id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const chronological = recentMessages.reverse(); // oldest → newest
    // Convert to the structure your prompt.service expects for building context text
    const chatHistory = chronological.map(m => ({
      role: m.role,       // "user" | "ai"
      content: m.content,
    }));

    // 3) Generate AI response
    const aiResponse = await generateChatResponse(
      chatSession.page,   // "learn" | "review" | "explain" | "roadmap"
      content,
      chatHistory
    );

    // 4) Save AI message with role "ai" (✅ matches enum)
    const aiMessage = await Message.create({
      chatSession: chatSession._id,
      content: aiResponse,
      role: "ai",
      metadata: { page: chatSession.page },
    });

    // Push AI message id
    chatSession.messages.push(aiMessage._id);

    // 5) Save session
    await chatSession.save();
    const chatMessages= [userMessage, aiMessage];
    console.log(userMessage);
    console.log("aiMEssage:",aiMessage)
    const markdownContent = chatMessages[1]?.content;

// Write to file
fs.writeFileSync("lesson.md", markdownContent, "utf-8");

console.log("✅ Markdown file created: lesson.md");
    console.log(chatMessages);
    // 6) Respond
    res.status(200).json({
      success: true,
      chatMessages,
      message: "message sent successfully",
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

/**
 * Delete a chat session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteChatSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const chatSession = await ChatSession.findById(id);

    if (!chatSession) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    // Check if the chat session belongs to the user
    if (chatSession.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access to chat session" });
    }

    // Delete all messages associated with this chat session
    await Message.deleteMany({ chatSession: id });

    // Delete the chat session
    await ChatSession.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Chat session deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting chat session:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete chat session", 
      error: error.message 
    });
  }
};

export {
  createChatSession,
  getChatSessionsByPage,
  getChatSessionById,
  sendMessage,
  deleteChatSession,
};