import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  createQuiz,
  createLearningMaterial,
  createCodeReview,
  explainCode,
  createRoadmap,
  createProblemQuestion
} from '../controllers/prompt.controller.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Quiz routes
router.post('/quiz', createQuiz);

// Learning material routes
router.post('/learning-material', createLearningMaterial);

// Code review routes
router.post('/code-review', createCodeReview);

// Code explanation routes
router.post('/explain-code', explainCode);

// Roadmap routes
router.post('/roadmap', createRoadmap);

// Problem question routes
router.post('/problem-question', createProblemQuestion);

export default router;
