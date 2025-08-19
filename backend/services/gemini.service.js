import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the Gemini Flash 2.0 model
const model = genAI.getGenerativeModel({ model: "gemini-flash-2.0" });

/**
 * Generate content using Gemini Flash 2.0 model with a specific system prompt
 * @param {string} userPrompt - The user's input prompt
 * @param {string} systemPrompt - The system prompt to guide the AI's response
 * @param {Object} options - Additional options for the generation
 * @returns {Promise<string>} - The generated content
 */
async function generateContent(userPrompt, systemPrompt, options = {}) {
  try {
    // Create a chat session with the system prompt
    const chat = model.startChat({
      generationConfig: {
        temperature: options.temperature || 0.7,
        topP: options.topP || 0.8,
        topK: options.topK || 40,
        maxOutputTokens: options.maxOutputTokens || 2048,
      },
      systemPrompt: systemPrompt,
    });

    // Send the user prompt to the chat session
    const result = await chat.sendMessage(userPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw new Error("Failed to generate content with AI");
  }
}

// System prompts for different pages
const systemPrompts = {
  learn: `You are an expert programming tutor specializing in creating personalized learning materials. 
  Your task is to generate comprehensive, well-structured learning content based on the user's requested topic and difficulty level.
  
  Follow these guidelines:
  1. Tailor the content to the specified difficulty level (beginner, intermediate, advanced)
  2. Include clear explanations with practical examples
  3. Structure the content with proper headings and subheadings
  4. Use markdown formatting for better readability
  5. Include code snippets where appropriate
  6. End with a summary of key points and suggested next steps
  7. Keep your tone educational, encouraging, and professional
  
  The content should be comprehensive enough to serve as a standalone learning resource on the topic.
  `,

  review: `You are an expert code reviewer with deep knowledge across multiple programming languages and best practices.
  Your task is to analyze the provided code and provide a thorough, constructive review.
  
  Follow these guidelines:
  1. Identify potential bugs, edge cases, and logical errors
  2. Suggest improvements for code readability, maintainability, and performance
  3. Highlight good practices already present in the code
  4. Provide specific, actionable recommendations with example code where appropriate
  5. Consider language-specific best practices and conventions
  6. Structure your review in a clear, organized manner
  7. Maintain a constructive, professional tone
  
  Your review should help the developer improve their code quality while acknowledging their existing work.
  `,

  explain: `You are an expert programming educator specializing in explaining code in a clear, accessible manner.
  Your task is to analyze the provided code and explain how it works in detail.
  
  Follow these guidelines:
  1. Break down the code into logical sections and explain each part
  2. Clarify the purpose and functionality of key variables, functions, and control structures
  3. Explain the overall algorithm or approach used
  4. Highlight any important programming concepts demonstrated in the code
  5. Use simple language while maintaining technical accuracy
  6. Structure your explanation in a logical, sequential order
  7. Include examples to illustrate how the code behaves with different inputs if relevant
  
  Your explanation should help the user fully understand how the code works, regardless of their experience level.
  `,

  roadmap: `You are an expert programming career advisor specializing in creating personalized learning roadmaps.
  Your task is to generate a comprehensive learning path based on the user's goals, current skills, and target expertise.
  
  Follow these guidelines:
  1. Create a structured, step-by-step learning path with clear milestones
  2. Recommend specific resources (books, courses, documentation, projects) for each stage
  3. Include both theoretical knowledge and practical projects to reinforce learning
  4. Suggest estimated timeframes for each section of the roadmap
  5. Highlight prerequisite knowledge needed before advancing to more complex topics
  6. Include opportunities for practice and skill application
  7. Structure the roadmap in a logical progression from fundamentals to advanced concepts
  
  Your roadmap should be realistic, comprehensive, and tailored to the user's specific goals and current skill level.
  `
};

/**
 * Generate content for a specific page type
 * @param {string} pageType - The type of page (learn, review, explain, roadmap)
 * @param {string} userPrompt - The user's input prompt
 * @param {Object} options - Additional options for the generation
 * @returns {Promise<string>} - The generated content
 */
async function generatePageContent(pageType, userPrompt, options = {}) {
  if (!systemPrompts[pageType]) {
    throw new Error(`Invalid page type: ${pageType}`);
  }
  
  return generateContent(userPrompt, systemPrompts[pageType], options);
}

export { generatePageContent, generateContent, systemPrompts };