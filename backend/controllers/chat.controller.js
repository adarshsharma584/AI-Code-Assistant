import { ChatSession } from "../models/chatSession.model.js";
import { Message } from "../models/message.model.js";
import { generateChatResponse } from "../services/prompt.service.js";

/**
 * Create a new chat session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createChatSession = async (req, res) => {
  try {
    const { title } = req.body;
    const {page}=req.params;
    const userId = req.user._id;

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
    const userId = req.user._id;

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
    const userId = req.user._id;

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
const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const chatSession = await ChatSession.findById(id);

    if (!chatSession) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    // Check if the chat session belongs to the user
    if (chatSession.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access to chat session" });
    }

    // Create user message
    const userMessage = await Message.create({
      chatSession: id,
      role: "user",
      content,
    });

    // Get recent messages for context (limit to last 10 for performance)
    const recentMessages = await Message.find({ chatSession: id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Reverse to get chronological order
    const chatHistory = recentMessages.reverse();

    // Generate AI response based on page type
    const aiResponseContent = await generateChatResponse(
      chatSession.page,
      content,
      chatHistory
    );

    // Create AI message
    const aiMessage = await Message.create({
      chatSession: id,
      role: "ai",
      content: aiResponseContent,
    });

    // Update lastUpdated timestamp
    chatSession.lastUpdated = Date.now();
    await chatSession.save();

    res.status(200).json({
      success: true,
      messages: [userMessage, aiMessage],
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send message", 
      error: error.message 
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
    const userId = req.user._id;

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