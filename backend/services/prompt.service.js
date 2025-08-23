import { generateContent, systemPrompts } from './gemini.service.js';

/**
 * Service for handling different types of AI prompts and specialized use cases
 */

/**
 * Generate a quiz based on a topic and difficulty level
 * @param {string} title - The title of the quiz
 * @param {string} topic - The topic of the quiz
 * @param {string} difficulty - The difficulty level (easy, medium, hard)
 * @param {number} questionCount - The number of questions to generate
 * @returns {Promise<Object>} - The generated quiz with questions and answers
 */
async function generateQuiz(title, topic, difficulty, questionCount = 10) {
  const systemPrompt = `You are an expert quiz creator specializing in programming and computer science topics.
  Your task is to create a quiz with ${questionCount} multiple-choice questions about ${topic} at a ${difficulty} difficulty level.
  
  The quiz should be returned as a JSON object with the following structure:
  {
    "questions": [
      {
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "The correct option (exactly matching one of the options)",
        "explanation": "A brief explanation of why this is the correct answer"
      },
      // More questions...
    ],
    "title": "${title}"
  }
  
  Ensure that:
  1. Questions are clear, concise, and directly related to the topic
  2. Each question has exactly 4 options
  3. Options are distinct and plausible
  4. The correct answer is exactly matching one of the options
  5. The explanation is informative and educational
  6. Questions increase in difficulty throughout the quiz
  7. The response is ONLY the valid JSON object with no additional text
  `;

  const userPrompt = `Create a ${difficulty} level quiz titled "${title}" about ${topic} with ${questionCount} questions.`;
  
  try {
    const jsonResponse = await generateContent(userPrompt, systemPrompt, { temperature: 0.5 });
    // Parse the response as JSON
    const quizData = JSON.parse(jsonResponse);
    return quizData;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz");
  }
}

/**
 * Generate learning material based on a topic and level
 * @param {string} title - The title of the learning material
 * @param {string} topic - The topic to generate material about
 * @param {string} level - The difficulty level (beginner, intermediate, advanced)
 * @returns {Promise<string>} - The generated learning material in markdown format
 */
async function generateLearningMaterial(title, topic, level) {
  // We can use the existing learn system prompt for this
  const userPrompt = `Create a comprehensive ${level} level learning material titled "${title}" about ${topic}. Include examples, explanations, and best practices.`;
  
  try {
    return await generateContent(userPrompt, systemPrompts.learn, { temperature: 0.7 });
  } catch (error) {
    console.error("Error generating learning material:", error);
    throw new Error("Failed to generate learning material");
  }
}

/**
 * Generate code review feedback for submitted code
 * @param {string} code - The code to review
 * @param {string} language - The programming language of the code
 * @param {string} context - Additional context about the code
 * @returns {Promise<string>} - The generated code review feedback
 */
async function generateCodeReview(code, language, context = "") {
  // We can use the existing review system prompt for this
  const userPrompt = `Please review the following ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nAdditional context: ${context}`;
  
  try {
    return await generateContent(userPrompt, systemPrompts.review, { temperature: 0.6 });
  } catch (error) {
    console.error("Error generating code review:", error);
    throw new Error("Failed to generate code review");
  }
}

/**
 * Generate code explanation for submitted code
 * @param {string} code - The code to explain
 * @param {string} language - The programming language of the code
 * @returns {Promise<string>} - The generated code explanation
 */
async function generateCodeExplanation(code, language) {
  // We can use the existing explain system prompt for this
  const userPrompt = `Please explain the following ${language} code in detail:\n\n\`\`\`${language}\n${code}\n\`\`\``;
  
  try {
    return await generateContent(userPrompt, systemPrompts.explain, { temperature: 0.6 });
  } catch (error) {
    console.error("Error generating code explanation:", error);
    throw new Error("Failed to generate code explanation");
  }
}

/**
 * Generate a learning roadmap based on user's goals and current skills
 * @param {string} goal - The user's learning goal
 * @param {string} currentSkills - The user's current skills and knowledge
 * @param {string} timeframe - The timeframe for the roadmap (e.g., "3 months", "1 year")
 * @returns {Promise<string>} - The generated learning roadmap
 */
async function generateLearningRoadmap(goal, currentSkills, timeframe) {
  // We can use the existing roadmap system prompt for this
  const userPrompt = `Create a learning roadmap to help me achieve the following goal: ${goal}.\n\nMy current skills and knowledge: ${currentSkills}.\n\nI want to achieve this goal within ${timeframe}.`;
  
  try {
    return await generateContent(userPrompt, systemPrompts.roadmap, { temperature: 0.7 });
  } catch (error) {
    console.error("Error generating learning roadmap:", error);
    throw new Error("Failed to generate learning roadmap");
  }
}

/**
 * Generate a response for a chat message based on the page type
 * @param {string} pageType - The type of page (learn, review, explain, roadmap)
 * @param {string} message - The user's message
 * @param {Array} chatHistory - The chat history (optional)
 * @returns {Promise<string>} - The generated response
 */
// Fallback responses for when the AI service is unavailable
const fallbackResponses = {
  learn: "I'm currently unable to generate learning materials. Please try again later or check your API key and quota.",
  review: "I can't provide code reviews at the moment. Please try again in a few minutes.",
  explain: "I'm having trouble explaining this right now. Please try again later.",
  roadmap: "I can't generate a learning roadmap right now. Please check back soon.",
  default: "I'm sorry, I'm having trouble connecting to the AI service. Please try again later."
};

async function generateChatResponse(pageType, message, chatHistory = []) {
  if (!systemPrompts[pageType]) {
    throw new Error(`Invalid page type: ${pageType}`);
  }
  
  // Format chat history for context if provided
  let contextPrompt = "";
  if (chatHistory && chatHistory.length > 0) {
    contextPrompt = "\n\nPrevious messages in this conversation:\n";
    chatHistory.forEach(msg => {
      contextPrompt += `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}\n`;
    });
    contextPrompt += "\nPlease respond to the most recent message considering this context.";
  }
  
  const userPrompt = `${message}${contextPrompt}`;
  
  try {
    return await generateContent(userPrompt, systemPrompts[pageType], { temperature: 0.8 });
  } catch (error) {
    console.error("Error generating chat response:", error);
    
    // Return a fallback response instead of throwing an error
    if (error.message.includes('quota') || error.message.includes('limit')) {
      return fallbackResponses[pageType] || fallbackResponses.default;
    }
    
    // If it's a different error, still return a helpful message
    return "I'm having trouble processing your request. The AI service might be temporarily unavailable. Please try again in a few minutes.";
  }
}

/**
 * Generate a practical problem-solving question based on a learning topic
 * @param {string} topic - The topic the user is learning about
 * @param {string} difficulty - The difficulty level (beginner, intermediate, advanced)
 * @returns {Promise<Object>} - The generated problem with starter code and solution
 */
async function generateProblemSolvingQuestion(topic, difficulty = 'intermediate') {
  const systemPrompt = `You are an expert programming instructor specializing in creating practical coding exercises.
  Your task is to create a problem-solving exercise related to ${topic} at a ${difficulty} difficulty level.
  
  The exercise should be returned as a JSON object with the following structure:
  {
    "title": "A clear, concise title for the exercise",
    "description": "A detailed description of the problem to solve, including requirements and expected behavior",
    "starterCode": "Starter code template that the user can build upon",
    "solution": "A complete working solution to the problem",
    "hints": ["Hint 1", "Hint 2", "Hint 3"],
    "testCases": ["Test case 1", "Test case 2", "Test case 3"],
    "learningObjectives": ["What the user will learn by solving this problem"]
  }
  
  Follow these guidelines:
  1. Create a practical, real-world problem that applies ${topic} concepts
  2. For React topics, focus on building small components or features (like a todo app with edit/delete for React states)
  3. Include enough starter code to give direction but leave the core implementation to the user
  4. Provide a complete, working solution that follows best practices
  5. Include 3-5 helpful hints that progressively guide the user toward the solution
  6. Include test cases or usage examples to verify the solution works
  7. The response must be ONLY the valid JSON object with no additional text
  `;

  const userPrompt = `Create a practical coding exercise about ${topic} at ${difficulty} level. If this is about React states, create a todo app exercise with edit and delete functionality.`;
  
  try {
    const jsonResponse = await generateContent(userPrompt, systemPrompt, { temperature: 0.7 });
    // Parse the response as JSON
    const problemData = JSON.parse(jsonResponse);
    return problemData;
  } catch (error) {
    console.error("Error generating problem-solving question:", error);
    throw new Error("Failed to generate problem-solving question");
  }
}

export {
  generateQuiz,
  generateLearningMaterial,
  generateCodeReview,
  generateCodeExplanation,
  generateLearningRoadmap,
  generateChatResponse,
  generateProblemSolvingQuestion
};