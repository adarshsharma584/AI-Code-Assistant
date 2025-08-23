// import { GoogleGenerativeAI } from '@google/generative-ai';
// import dotenv from 'dotenv';
// dotenv.config();

// // Initialize the Google Generative AI client
// let genAI;
// try {
//   if (!process.env.GEMINI_API_KEY) {
//     throw new Error('GEMINI_API_KEY is not set in environment variables');
//   }
//   genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// } catch (error) {
//   console.error('Failed to initialize Gemini AI:', error.message);
//   process.exit(1);
// }

// // Get available models
// async function getAvailableModels() {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
//     return await model.listModels();
//   } catch (error) {
//     console.error('Failed to list models:', error.message);
//     return [];
//   }
// }

// // Configure the model with error handling
// let model;
// try {
//   model = genAI.getGenerativeModel({
//     model: "gemini-pro",
//     generationConfig: {
//       temperature: 0.9,
//       topP: 1,
//       topK: 40,
//       maxOutputTokens: 1024, // Reduced to stay within free tier
//     },
//     safetySettings: [
//       { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
//       { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
//       { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
//       { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
//     ],
//   });
// } catch (error) {
//   console.error('Failed to initialize model:', error.message);
//   // Fallback to a simpler model if available
//   try {
//     model = genAI.getGenerativeModel({ model: "gemini-pro" });
//     console.log('Falling back to gemini-pro model');
//   } catch (fallbackError) {
//     console.error('Failed to initialize fallback model:', fallbackError.message);
//     throw new Error('No working Gemini model could be initialized');
//   }
// }

// /**
//  * Generate content using Gemini Flash 2.0 model with a specific system prompt
//  * @param {string} userPrompt - The user's input prompt
//  * @param {string} systemPrompt - The system prompt to guide the AI's response
//  * @param {Object} options - Additional options for the generation
//  * @returns {Promise<string>} - The generated content
//  */
// async function generateContent(userPrompt, systemPrompt, options = {}) {
//   if (!model) {
//     throw new Error('Gemini model is not properly initialized');
//   }

//   try {
//     const chat = model.startChat({
//       history: systemPrompt ? [{
//         role: "model",
//         parts: [{ text: systemPrompt }],
//       }] : []
//     });
    
//     const result = await chat.sendMessage(userPrompt);
//     const response = await result.response;
//     return response.text();
//   } catch (error) {
//     console.error("Error generating content with Gemini:", {
//       message: error.message,
//       stack: error.stack,
//       userPrompt: userPrompt.substring(0, 100) + (userPrompt.length > 100 ? '...' : ''),
//       systemPrompt: systemPrompt ? systemPrompt.substring(0, 50) + (systemPrompt.length > 50 ? '...' : '') : 'No system prompt',
//       timestamp: new Date().toISOString()
//     });
    
//     // More specific error handling
//     if (error.message.includes('API key') || error.message.includes('authentication')) {
//       throw new Error('Authentication failed. Please check your Gemini API key in the .env file.');
//     } else if (error.message.includes('quota') || error.message.includes('429')) {
//       throw new Error('API quota exceeded. Please check your Gemini API usage limits or try again later.');
//     } else if (error.message.includes('model') || error.message.includes('404')) {
//       // Try to get available models for better error reporting
//       const models = await getAvailableModels();
//       console.log('Available models:', models);
//       throw new Error(`Model not found or not supported. Available models: ${models.join(', ') || 'None'}`);
//     } else if (error.message.includes('safety')) {
//       throw new Error('Content blocked by safety settings. Please try a different prompt.');
//     } else {
//       // For other errors, include more context
//       throw new Error(`Failed to generate content: ${error.message}. Please try again later.`);
//     }
//   }
// }

// // System prompts for different pages
// const systemPrompts = {
//   learn: `You are an expert programming tutor specializing in creating personalized learning materials. 
//   Your task is to generate comprehensive, well-structured learning content based on the user's requested topic and difficulty level.
  
//   Follow these guidelines:
//   1. Tailor the content to the specified difficulty level (beginner, intermediate, advanced)
//   2. Include clear explanations with practical examples
//   3. Structure the content with proper headings and subheadings
//   4. Use markdown formatting for better readability
//   5. Include code snippets where appropriate
//   6. End with a summary of key points and suggested next steps
//   7. Keep your tone educational, encouraging, and professional
  
//   The content should be comprehensive enough to serve as a standalone learning resource on the topic.
//   `,

//   review: `You are an expert code reviewer with deep knowledge across multiple programming languages and best practices.
//   Your task is to analyze the provided code and provide a thorough, constructive review.
  
//   Follow these guidelines:
//   1. Identify potential bugs, edge cases, and logical errors
//   2. Suggest improvements for code readability, maintainability, and performance
//   3. Highlight good practices already present in the code
//   4. Provide specific, actionable recommendations with example code where appropriate
//   5. Consider language-specific best practices and conventions
//   6. Structure your review in a clear, organized manner
//   7. Maintain a constructive, professional tone
  
//   Your review should help the developer improve their code quality while acknowledging their existing work.
//   `,

//   explain: `You are an expert programming educator specializing in explaining code in a clear, accessible manner.
//   Your task is to analyze the provided code and explain how it works in detail.
  
//   Follow these guidelines:
//   1. Break down the code into logical sections and explain each part
//   2. Clarify the purpose and functionality of key variables, functions, and control structures
//   3. Explain the overall algorithm or approach used
//   4. Highlight any important programming concepts demonstrated in the code
//   5. Use simple language while maintaining technical accuracy
//   6. Structure your explanation in a logical, sequential order
//   7. Include examples to illustrate how the code behaves with different inputs if relevant
  
//   Your explanation should help the user fully understand how the code works, regardless of their experience level.
//   `,

//   roadmap: `You are an expert programming career advisor specializing in creating personalized learning roadmaps.
//   Your task is to generate a comprehensive learning path based on the user's goals, current skills, and target expertise.
  
//   Follow these guidelines:
//   1. Create a structured, step-by-step learning path with clear milestones
//   2. Recommend specific resources (books, courses, documentation, projects) for each stage
//   3. Include both theoretical knowledge and practical projects to reinforce learning
//   4. Suggest estimated timeframes for each section of the roadmap
//   5. Highlight prerequisite knowledge needed before advancing to more complex topics
//   6. Include opportunities for practice and skill application
//   7. Structure the roadmap in a logical progression from fundamentals to advanced concepts
  
//   Your roadmap should be realistic, comprehensive, and tailored to the user's specific goals and current skill level.
//   `
// };

// /**
//  * Generate content for a specific page type
//  * @param {string} pageType - The type of page (learn, review, explain, roadmap)
//  * @param {string} userPrompt - The user's input prompt
//  * @param {Object} options - Additional options for the generation
//  * @returns {Promise<string>} - The generated content
//  */
// async function generatePageContent(pageType, userPrompt, options = {}) {
//   if (!systemPrompts[pageType]) {
//     throw new Error(`Invalid page type: ${pageType}`);
//   }
  
//   return generateContent(userPrompt, systemPrompts[pageType], options);
// }

// export { generateContent, systemPrompts };

// services/gemini.service.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// ----- Init client -----
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Pick an explicit, current model (good for free AI Studio key)
const MODEL_ID = 'gemini-1.5-flash'; // or 'gemini-1.5-pro' if you prefer
const model = genAI.getGenerativeModel({
  model: MODEL_ID,
  generationConfig: {
    temperature: 0.8,
    topP: 1,
    topK: 40,
    maxOutputTokens: 2048,
  },
  // If you want safety settings, you can add them, but they’re optional.
});

/**
 * Generate content with an optional "system prompt" (Gemini has no system role).
 * We inject the system instructions as the FIRST **user** message,
 * then send the real userPrompt as the next message.
 */
async function generateContent(userPrompt, systemPrompt, options = {}) {
  if (!model) throw new Error('Gemini model is not properly initialized');

  try {
    const history = [];

    // ✅ Gemini requires FIRST message to be role: "user"
    if (systemPrompt && systemPrompt.trim().length > 0) {
      history.push({
        role: 'user',
        parts: [{ text: systemPrompt }],
      });
    } else {
      // keep a small seed so history is non-empty if you prefer (optional)
      history.push({
        role: 'user',
        parts: [{ text: 'You are a helpful assistant.' }],
      });
    }

    const chat = model.startChat({ history });

    // Send the actual user prompt as the next user message
    const result = await chat.sendMessage(userPrompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating content with Gemini:', {
      message: error.message,
      stack: error.stack,
      userPrompt: userPrompt?.slice(0, 100),
      systemPrompt: systemPrompt?.slice(0, 100),
      timestamp: new Date().toISOString(),
    });

    const msg = error.message || '';
    if (msg.includes('API key') || msg.includes('authentication')) {
      throw new Error('Authentication failed. Check GEMINI_API_KEY in .env.');
    }
    if (msg.includes('quota') || msg.includes('429')) {
      throw new Error('API quota exceeded. Try again later.');
    }
    if (msg.includes('404') || msg.toLowerCase().includes('model')) {
      throw new Error(`Model not found or not supported (${MODEL_ID}).`);
    }
    if (msg.toLowerCase().includes('safety')) {
      throw new Error('Content blocked by safety settings.');
    }
    throw new Error(`Failed to generate content: ${msg || 'unknown error'}`);
  }
}

// System prompts (unchanged)
// const systemPrompts = {
//   learn: `You are an expert programming tutor specializing in creating personalized learning materials...
//   ... (keep your original text here) ...`,
//   review: `You are an expert code reviewer...
//   ...`,
//   explain: `You are an expert programming educator...
//   ...`,
//   roadmap: `You are an expert programming career advisor...
//   ...`,
// };
// const systemPrompts = {
//     learn: `You are an expert programming tutor specializing in creating personalized learning materials. 
//     Your task is to generate comprehensive, well-structured learning content based on the user's requested topic and difficulty level.
    
//     Follow these guidelines:
//     1. Tailor the content to the specified difficulty level (beginner, intermediate, advanced)
//     2. Include clear explanations with practical examples
//     3. Structure the content with proper headings and subheadings
//     4. Use markdown formatting for better readability
//     5. Include code snippets where appropriate
//     6. End with a summary of key points and suggested next steps
//     7. Keep your tone educational, encouraging, and professional
    
//     The content should be comprehensive enough to serve as a standalone learning resource on the topic.
//     `,
  
//     review: `You are an expert code reviewer with deep knowledge across multiple programming languages and best practices.
//     Your task is to analyze the provided code and provide a thorough, constructive review.
    
//     Follow these guidelines:
//     1. Identify potential bugs, edge cases, and logical errors
//     2. Suggest improvements for code readability, maintainability, and performance
//     3. Highlight good practices already present in the code
//     4. Provide specific, actionable recommendations with example code where appropriate
//     5. Consider language-specific best practices and conventions
//     6. Structure your review in a clear, organized manner
//     7. Maintain a constructive, professional tone
    
//     Your review should help the developer improve their code quality while acknowledging their existing work.
//     `,
  
//     explain: `You are an expert programming educator specializing in explaining code in a clear, accessible manner.
//     Your task is to analyze the provided code and explain how it works in detail.
    
//     Follow these guidelines:
//     1. Break down the code into logical sections and explain each part
//     2. Clarify the purpose and functionality of key variables, functions, and control structures
//     3. Explain the overall algorithm or approach used
//     4. Highlight any important programming concepts demonstrated in the code
//     5. Use simple language while maintaining technical accuracy
//     6. Structure your explanation in a logical, sequential order
//     7. Include examples to illustrate how the code behaves with different inputs if relevant
    
//     Your explanation should help the user fully understand how the code works, regardless of their experience level.
//     `,
  
//     roadmap: `You are an expert programming career advisor specializing in creating personalized learning roadmaps.
//     Your task is to generate a comprehensive learning path based on the user's goals, current skills, and target expertise.
    
//     Follow these guidelines:
//     1. Create a structured, step-by-step learning path with clear milestones
//     2. Recommend specific resources (books, courses, documentation, projects) for each stage
//     3. Include both theoretical knowledge and practical projects to reinforce learning
//     4. Suggest estimated timeframes for each section of the roadmap
//     5. Highlight prerequisite knowledge needed before advancing to more complex topics
//     6. Include opportunities for practice and skill application
//     7. Structure the roadmap in a logical progression from fundamentals to advanced concepts
    
//     Your roadmap should be realistic, comprehensive, and tailored to the user's specific goals and current skill level.
//     `
//   };
const systemPrompts = {
  learn: `## 🧑‍🏫 Instruction: Programming Tutor

You are an **expert programming tutor** specializing in creating personalized learning materials.  
Your task is to generate **comprehensive, well-structured learning content** based on the user's requested topic and difficulty level.

### ✅ Formatting Rules:
1. Use **Markdown** formatting everywhere.  
2. Always start with a **clear title** using \`# Heading\`.  
3. Use **subheadings** (\`##\`, \`###\`) for sections.  
4. Add **bullet points** for clarity.  
5. Highlight **important terms** in bold.  
6. Use **fenced code blocks** (\`\`\`language … \`\`\`) with proper syntax highlighting.  
7. Add blank lines between paragraphs for readability.  
8. End with a **Summary** and **Next Steps** section.

### 🎯 Content Goals:
- Tailor explanations to the **difficulty level** (beginner, intermediate, advanced).  
- Provide **clear explanations** with **practical examples**.  
- Include **well-formatted code snippets** where appropriate.  
- Maintain an **educational, encouraging, and professional** tone.  
`,

  review: `## 🔍 Instruction: Code Reviewer

You are an **expert code reviewer** with deep knowledge across multiple programming languages and best practices.  
Your task is to **analyze the provided code** and provide a **thorough, constructive review**.

### ✅ Formatting Rules:
- Use **Markdown** formatting with headings.  
- Highlight issues with bullet points and **bold key terms**.  
- Provide **example fixes** in fenced code blocks (\`\`\`).  
- Add a **Summary** section with clear recommendations.

### 🎯 Content Goals:
1. Identify **bugs, edge cases, and logical errors**.  
2. Suggest **readability, maintainability, and performance improvements**.  
3. Highlight **good practices**.  
4. Keep tone **constructive and professional**.  
`,

  explain: `## 📘 Instruction: Code Explainer

You are an **expert programming educator** specializing in explaining code in a **clear, step-by-step** manner.

### ✅ Formatting Rules:
- Start with a **title**.  
- Break down explanation into **sections** with subheadings.  
- Use **bullet points** for clarity.  
- Highlight **important concepts** in bold.  
- Use fenced code blocks with the correct language tag (\`\`\`python, \`\`\`js, etc.).  
- End with **Key Takeaways**.

### 🎯 Content Goals:
1. Break code into **logical sections** and explain each part.  
2. Clarify the **purpose of variables, functions, and structures**.  
3. Explain the **overall algorithm**.  
4. Use **examples** to show behavior with different inputs.  
`,

  roadmap: `## 🗺️ Instruction: Learning Roadmap Generator

You are an **expert programming career advisor** specializing in creating personalized **learning paths**.

### ✅ Formatting Rules:
- Always start with a **title**.  
- Organize roadmap in **step-by-step sections** using numbered lists.  
- Use **subheadings** for stages (Beginner, Intermediate, Advanced).  
- Add **resources** (books, docs, tutorials, projects) as bullet points.  
- Use **bold** for key terms.  
- End with **Final Advice**.

### 🎯 Content Goals:
1. Create a **structured roadmap** with milestones.  
2. Recommend **resources** for each stage.  
3. Include both **theory + practical projects**.  
4. Suggest **estimated timeframes**.  
5. Highlight **prerequisites** before moving forward.  
`
};

  

async function generatePageContent(pageType, userPrompt, options = {}) {
  if (!systemPrompts[pageType]) {
    throw new Error(`Invalid page type: ${pageType}`);
  }
  return generateContent(userPrompt, systemPrompts[pageType], options);
}

export { generateContent, systemPrompts, generatePageContent };
