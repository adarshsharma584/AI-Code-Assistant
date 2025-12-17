import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

function getModel(id) {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: id,
    generationConfig: { temperature: 0.7, topP: 1, topK: 40, maxOutputTokens: 2048 },
  });
}

export async function generateContent(userPrompt, systemPrompt) {
  try {
    const primary = getModel("gemini-1.5-flash");
    const fallback = getModel("gemini-1.5-pro");
    if (!primary && !fallback) throw new Error("Gemini not initialized");
    const history = [];
    const sys = systemPrompt && systemPrompt.trim().length > 0 ? systemPrompt : "You are a helpful assistant.";
    history.push({ role: "user", parts: [{ text: sys }] });
    const trySend = async (m) => {
      const chat = m.startChat({ history });
      const result = await chat.sendMessage(userPrompt);
      return result.response.text();
    };
    try {
      return await trySend(primary || fallback);
    } catch (e) {
      if (fallback && (e.message.includes("404") || e.message.toLowerCase().includes("model"))) {
        return await trySend(fallback);
      }
      throw e;
    }
  } catch (error) {
    const msg = error?.message || "";
    if (msg.includes("API key") || msg.includes("authentication")) throw new Error("Authentication failed");
    if (msg.includes("quota") || msg.includes("429")) throw new Error("Quota exceeded");
    if (msg.toLowerCase().includes("safety")) throw new Error("Safety blocked");
    throw new Error(msg || "Failed to generate content");
  }
}
