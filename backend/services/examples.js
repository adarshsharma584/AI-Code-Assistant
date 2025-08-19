/**
 * Examples of how to use the Gemini AI services in different controllers
 * This file is for reference only and is not meant to be imported
 */

// Example 1: Generating a quiz in a quiz controller

import { generateQuiz } from '../services/prompt.service.js';

const createQuiz = async (req, res) => {
  try {
    const { title, topic, difficulty, questionCount } = req.body;
    const userId = req.user._id;
    
    // Generate quiz using Gemini AI
    const quizData = await generateQuiz(title, topic, difficulty, questionCount);
    
    // Save quiz to database
    const quiz = await Quiz.create({
      user: userId,
      title,
      topic,
      difficulty,
      questions: quizData.questions,
      createdAt: Date.now()
    });
    
    res.status(201).json({
      success: true,
      quiz
    });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create quiz', 
      error: error.message 
    });
  }
};

// Example 2: Generating learning material in a learning controller

import { generateLearningMaterial } from '../services/prompt.service.js';

const createLearningMaterial = async (req, res) => {
  try {
    const { title, topic, level } = req.body;
    const userId = req.user._id;
    
    // Generate learning material using Gemini AI
    const content = await generateLearningMaterial(title, topic, level);
    
    // Save learning material to database
    const material = await LearningMaterial.create({
      user: userId,
      title,
      topic,
      level,
      content,
      createdAt: Date.now()
    });
    
    res.status(201).json({
      success: true,
      material
    });
  } catch (error) {
    console.error('Error creating learning material:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create learning material', 
      error: error.message 
    });
  }
};

// Example 3: Code review in a code controller

import { generateCodeReview } from '../services/prompt.service.js';

const reviewCode = async (req, res) => {
  try {
    const { code, language, context } = req.body;
    const userId = req.user._id;
    
    // Generate code review using Gemini AI
    const review = await generateCodeReview(code, language, context);
    
    // Save code review to database
    const codeReview = await CodeReview.create({
      user: userId,
      code,
      language,
      review,
      createdAt: Date.now()
    });
    
    res.status(201).json({
      success: true,
      codeReview
    });
  } catch (error) {
    console.error('Error reviewing code:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to review code', 
      error: error.message 
    });
  }
};

// Example 4: Code explanation in a code controller

import { generateCodeExplanation } from '../services/prompt.service.js';

const explainCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    const userId = req.user._id;
    
    // Generate code explanation using Gemini AI
    const explanation = await generateCodeExplanation(code, language);
    
    // Save code explanation to database
    const codeExplanation = await CodeExplanation.create({
      user: userId,
      code,
      language,
      explanation,
      createdAt: Date.now()
    });
    
    res.status(201).json({
      success: true,
      codeExplanation
    });
  } catch (error) {
    console.error('Error explaining code:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to explain code', 
      error: error.message 
    });
  }
};

// Example 5: Learning roadmap in a roadmap controller

import { generateLearningRoadmap } from '../services/prompt.service.js';

const createRoadmap = async (req, res) => {
  try {
    const { goal, currentSkills, timeframe } = req.body;
    const userId = req.user._id;
    
    // Generate learning roadmap using Gemini AI
    const content = await generateLearningRoadmap(goal, currentSkills, timeframe);
    
    // Save learning roadmap to database
    const roadmap = await LearningRoadmap.create({
      user: userId,
      goal,
      currentSkills,
      timeframe,
      content,
      createdAt: Date.now()
    });
    
    res.status(201).json({
      success: true,
      roadmap
    });
  } catch (error) {
    console.error('Error creating roadmap:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create roadmap', 
      error: error.message 
    });
  }
};