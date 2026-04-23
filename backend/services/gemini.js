import config from "../config/index.js";
import { PRODUCT_SYSTEM_PROMPT } from "../prompts/productSearch.js";

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const GEMINI_MODEL = config.geminiModel;

const geminiUrl = (model) => `${GEMINI_BASE}/${model}:generateContent`;

const geminiHeaders = () => ({
  "Content-Type": "application/json",
  "X-goog-api-key": config.geminiKey,
});

export const geminiChat = async (message) => {
  const res = await fetch(geminiUrl(GEMINI_MODEL), {
    method: "POST",
    headers: geminiHeaders(),
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: message }] }],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response from model";
};

export const geminiProductSearch = async (message) => {
  const res = await fetch(geminiUrl(GEMINI_MODEL), {
    method: "POST",
    headers: geminiHeaders(),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: PRODUCT_SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: message }] }],
      tools: [{ googleSearch: {} }],
      generationConfig: { temperature: 0, maxOutputTokens: 4000 },
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
};
