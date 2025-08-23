import { 
  generateQuiz, 
  generateLearningMaterial, 
  generateCodeReview, 
  generateCodeExplanation, 
  generateLearningRoadmap,
  generateProblemSolvingQuestion,
  generateChatResponse
} from '../services/prompt.service.js';
import ChatSession from '../models/chatSession.model.js';
import Message from '../models/message.model.js';
import fs from 'fs';

/**
 * @description Controller for handling all prompt-related operations
 */

// Generate a new quiz
const createQuiz = async (req, res) => {
  try {
    const { title, topic, difficulty, questionCount, chatSessionId } = req.body;
    const userId = req.user.id;

    if (!title || !topic || !difficulty) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, topic, and difficulty are required' 
      });
    }

    // Create a new chat session if no sessionId provided
    let chatSession;
    if (chatSessionId) {
      chatSession = await ChatSession.findById(chatSessionId);
      if (!chatSession) {
        return res.status(404).json({ message: 'Chat session not found' });
      }
      if (chatSession.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Unauthorized access to chat session' });
      }
    } else {
      chatSession = await ChatSession.create({
        user: userId,
        title: title || 'Quiz Session',
        page: 'quiz'
      });
    }

    // Save user message
    const userMessage = await Message.create({
      chatSession: chatSession._id,
      role: 'user',
      content: `Generate a quiz about ${topic} with difficulty ${difficulty}`,
      metadata: { title, topic, difficulty, questionCount: questionCount || 10 }
    });

    chatSession.messages.push(userMessage._id);
    
    // Get recent messages for context
    const recentMessages = await Message.find({ chatSession: chatSession._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const chatHistory = recentMessages.reverse().map(m => ({
      role: m.role,
      content: m.content
    }));

    // Generate quiz
    const quiz = await generateQuiz(title, topic, difficulty, questionCount || 10);
    
    // Save AI response
    const aiMessage = await Message.create({
      chatSession: chatSession._id,
      role: 'ai',
      content: JSON.stringify(quiz),
      metadata: { type: 'quiz', data: quiz }
    });

    chatSession.messages.push(aiMessage._id);
    await chatSession.save();

    res.status(201).json({
      success: true,
      data: {
        chatSessionId: chatSession._id,
        messages: [userMessage, aiMessage],
        quiz
      },
      message: 'Quiz generated successfully'
    });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error
    });
  }
};

// Generate learning material
const createLearningMaterial = async (req, res) => {
  try {
    const { title, topic, level, chatSessionId } = req.body;
    const userId = req.user.id;

    if (!title || !topic || !level) {
      return res.status(400).json({
        success: false,
        message: 'Title, topic, and level are required'
      });
    }

    // Create or find chat session
    let chatSession;
    if (chatSessionId) {
      chatSession = await ChatSession.findById(chatSessionId);
      if (!chatSession) {
        return res.status(404).json({ message: 'Chat session not found' });
      }
      if (chatSession.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Unauthorized access to chat session' });
      }
    } else {
      chatSession = await ChatSession.create({
        user: userId,
        title: title || 'Learning Material',
        page: 'learn'
      });
    }

    // Save user message
    const userMessage = await Message.create({
      chatSession: chatSession._id,
      role: 'user',
      content: `Generate learning material about ${topic} at ${level} level`,
      metadata: { title, topic, level }
    });

    chatSession.messages.push(userMessage._id);
    
    // Get recent messages for context
    const recentMessages = await Message.find({ chatSession: chatSession._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const chatHistory = recentMessages.reverse().map(m => ({
      role: m.role,
      content: m.content
    }));

    // Generate material
    const material = await generateLearningMaterial(title, topic, level);
    
    // Save AI response
    const aiMessage = await Message.create({
      chatSession: chatSession._id,
      role: 'ai',
      content: material,
      metadata: { type: 'learning_material', topic, level }
    });

    chatSession.messages.push(aiMessage._id);
    await chatSession.save();

    // Save to markdown file
    const markdownContent = `# ${title}\n\n${material}`;
    fs.writeFileSync(`learning_${chatSession._id}.md`, markdownContent, 'utf-8');

    res.status(200).json({
      success: true,
      data: {
        chatSessionId: chatSession._id,
        messages: [userMessage, aiMessage],
        material: {
          title,
          topic,
          level,
          content: material
        }
      },
      message: 'Learning material generated successfully'
    });
  } catch (error) {
    console.error('Error generating learning material:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error
    });
  }
};

// Generate code review
const createCodeReview = async (req, res) => {
  try {
    const { code, language, context, chatSessionId } = req.body;
    const userId = req.user.id;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Code and language are required'
      });
    }

    // Create or find chat session
    let chatSession;
    if (chatSessionId) {
      chatSession = await ChatSession.findById(chatSessionId);
      if (!chatSession) {
        return res.status(404).json({ message: 'Chat session not found' });
      }
      if (chatSession.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Unauthorized access to chat session' });
      }
    } else {
      chatSession = await ChatSession.create({
        user: userId,
        title: 'Code Review',
        page: 'review'
      });
    }

    // Save user message
    const userMessage = await Message.create({
      chatSession: chatSession._id,
      role: 'user',
      content: `Review this ${language} code: ${code}\n\nContext: ${context || 'No additional context provided'}`,
      metadata: { language, context: context || '' }
    });

    chatSession.messages.push(userMessage._id);
    
    // Get recent messages for context
    const recentMessages = await Message.find({ chatSession: chatSession._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const chatHistory = recentMessages.reverse().map(m => ({
      role: m.role,
      content: m.content
    }));

    // Generate code review
    const review = await generateCodeReview(code, language, context || '');
    
    // Save AI response
    const aiMessage = await Message.create({
      chatSession: chatSession._id,
      role: 'ai',
      content: review,
      metadata: { type: 'code_review', language }
    });

    chatSession.messages.push(aiMessage._id);
    await chatSession.save();

    res.status(200).json({
      success: true,
      data: {
        chatSessionId: chatSession._id,
        messages: [userMessage, aiMessage],
        review
      },
      message: 'Code review generated successfully'
    });
  } catch (error) {
    console.error('Error generating code review:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error
    });
  }
};

// Generate code explanation
const explainCode = async (req, res) => {
  try {
    const { code, language, chatSessionId } = req.body;
    const userId = req.user.id;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Code and language are required'
      });
    }

    // Create or find chat session
    let chatSession;
    if (chatSessionId) {
      chatSession = await ChatSession.findById(chatSessionId);
      if (!chatSession) {
        return res.status(404).json({ message: 'Chat session not found' });
      }
      if (chatSession.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Unauthorized access to chat session' });
      }
    } else {
      chatSession = await ChatSession.create({
        user: userId,
        title: 'Code Explanation',
        page: 'explain'
      });
    }

    // Save user message
    const userMessage = await Message.create({
      chatSession: chatSession._id,
      role: 'user',
      content: `Explain this ${language} code: ${code}`,
      metadata: { language }
    });

    chatSession.messages.push(userMessage._id);
    
    // Get recent messages for context
    const recentMessages = await Message.find({ chatSession: chatSession._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const chatHistory = recentMessages.reverse().map(m => ({
      role: m.role,
      content: m.content
    }));

    // Generate explanation
    const explanation = await generateCodeExplanation(code, language);
    
    // Save AI response
    const aiMessage = await Message.create({
      chatSession: chatSession._id,
      role: 'ai',
      content: explanation,
      metadata: { type: 'code_explanation', language }
    });

    chatSession.messages.push(aiMessage._id);
    await chatSession.save();

    res.status(200).json({
      success: true,
      data: {
        chatSessionId: chatSession._id,
        messages: [userMessage, aiMessage],
        explanation
      },
      message: 'Code explanation generated successfully'
    });
  } catch (error) {
    console.error('Error generating code explanation:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error
    });
  }
};

// Generate learning roadmap
const createRoadmap = async (req, res) => {
  try {
    const { goal, currentSkills, timeframe, chatSessionId } = req.body;
    const userId = req.user.id;

    if (!goal || !currentSkills || !timeframe) {
      return res.status(400).json({
        success: false,
        message: 'Goal, current skills, and timeframe are required'
      });
    }

    // Create or find chat session
    let chatSession;
    if (chatSessionId) {
      chatSession = await ChatSession.findById(chatSessionId);
      if (!chatSession) {
        return res.status(404).json({ message: 'Chat session not found' });
      }
      if (chatSession.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Unauthorized access to chat session' });
      }
    } else {
      chatSession = await ChatSession.create({
        user: userId,
        title: `Learning Roadmap: ${goal}`,
        page: 'roadmap'
      });
    }

    // Save user message
    const userMessage = await Message.create({
      chatSession: chatSession._id,
      role: 'user',
      content: `Create a learning roadmap for: ${goal}\n\nCurrent Skills: ${currentSkills}\nTimeframe: ${timeframe}`,
      metadata: { goal, currentSkills, timeframe }
    });

    chatSession.messages.push(userMessage._id);
    
    // Get recent messages for context
    const recentMessages = await Message.find({ chatSession: chatSession._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const chatHistory = recentMessages.reverse().map(m => ({
      role: m.role,
      content: m.content
    }));

    // Generate roadmap
    const roadmap = await generateLearningRoadmap(goal, currentSkills, timeframe);
    
    // Save AI response
    const aiMessage = await Message.create({
      chatSession: chatSession._id,
      role: 'ai',
      content: roadmap,
      metadata: { type: 'learning_roadmap', goal, timeframe }
    });

    chatSession.messages.push(aiMessage._id);
    await chatSession.save();

    // Save to markdown file
    const markdownContent = `# Learning Roadmap: ${goal}\n\n## Current Skills\n${currentSkills}\n\n## Timeframe\n${timeframe}\n\n## Roadmap\n${roadmap}`;
    fs.writeFileSync(`roadmap_${chatSession._id}.md`, markdownContent, 'utf-8');

    res.status(200).json({
      success: true,
      data: {
        chatSessionId: chatSession._id,
        messages: [userMessage, aiMessage],
        roadmap: {
          goal,
          currentSkills,
          timeframe,
          content: roadmap
        }
      },
      message: 'Learning roadmap generated successfully'
    });
  } catch (error) {
    console.error('Error generating learning roadmap:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error
    });
  }
};

// Generate problem-solving question
const createProblemQuestion = async (req, res) => {
  try {
    const { topic, difficulty, chatSessionId } = req.body;
    const userId = req.user.id;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Topic is required'
      });
    }

    // Create or find chat session
    let chatSession;
    if (chatSessionId) {
      chatSession = await ChatSession.findById(chatSessionId);
      if (!chatSession) {
        return res.status(404).json({ message: 'Chat session not found' });
      }
      if (chatSession.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Unauthorized access to chat session' });
      }
    } else {
      chatSession = await ChatSession.create({
        user: userId,
        title: `Problem: ${topic}`,
        page: 'problem'
      });
    }

    // Save user message
    const userMessage = await Message.create({
      chatSession: chatSession._id,
      role: 'user',
      content: `Generate a ${difficulty || 'intermediate'} level problem about ${topic}`,
      metadata: { topic, difficulty: difficulty || 'intermediate' }
    });

    chatSession.messages.push(userMessage._id);
    
    // Get recent messages for context
    const recentMessages = await Message.find({ chatSession: chatSession._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const chatHistory = recentMessages.reverse().map(m => ({
      role: m.role,
      content: m.content
    }));

    // Generate problem
    const problem = await generateProblemSolvingQuestion(topic, difficulty || 'intermediate');
    
    // Save AI response
    const aiMessage = await Message.create({
      chatSession: chatSession._id,
      role: 'ai',
      content: JSON.stringify(problem),
      metadata: { 
        type: 'problem_question',
        topic,
        difficulty: difficulty || 'intermediate',
        problemData: problem
      }
    });

    chatSession.messages.push(aiMessage._id);
    await chatSession.save();

    res.status(200).json({
      success: true,
      data: {
        chatSessionId: chatSession._id,
        messages: [userMessage, aiMessage],
        problem
      },
      message: 'Problem question generated successfully'
    });
  } catch (error) {
    console.error('Error generating problem question:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error
    });
  }
};

export {
  createQuiz,
  createLearningMaterial,
  createCodeReview,
  explainCode,
  createRoadmap,
  createProblemQuestion
};
