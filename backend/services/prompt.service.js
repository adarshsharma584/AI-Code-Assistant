import { systemPrompts } from "./prompts.js";
import { generateContent } from "./gemini.service.js";

export async function generateLearningMaterial({ title, topic, level }) {
  const userPrompt = `Title: ${title}\nTopic: ${topic}\nLevel: ${level}\nReturn markdown with sections and examples.`;
  try {
    return await generateContent(userPrompt, systemPrompts.learn);
  } catch (e) {
    return `# ${title}\n\n## ${topic} (${level})\n\nThis is a fallback.`;
  }
}

export async function generateCodeReview({ code, language, context }) {
  const userPrompt = `Language: ${language}\nContext: ${context || ""}\nCode:\n${code}`;
  try {
    return await generateContent(userPrompt, systemPrompts.review);
  } catch (e) {
    return `## Code Review\n\nLanguage: ${language}\nContext: ${context || ""}`;
  }
}

export async function generateCodeExplanation({ code, language }) {
  const userPrompt = `Language: ${language}\nExplain the following code:\n${code}`;
  try {
    return await generateContent(userPrompt, systemPrompts.explain);
  } catch (e) {
    return `## Explanation\n\nLanguage: ${language}`;
  }
}

export async function generateRoadmap({ goal, currentSkills, timeframe }) {
  const userPrompt = `Goal: ${goal}\nCurrent skills: ${currentSkills || ""}\nTimeframe: ${timeframe || ""}\nGenerate a phased roadmap.`;
  try {
    return await generateContent(userPrompt, systemPrompts.roadmap);
  } catch (e) {
    return `# Roadmap\n\nGoal: ${goal}\nTimeframe: ${timeframe || ""}`;
  }
}
