import { Router } from "express";
import crypto from "crypto";
import config from "../config/index.js";
import { chatLimiter } from "../middleware/rateLimiter.js";
import { PRODUCT_SYSTEM_PROMPT } from "../prompts/productSearch.js";

const router = Router();

/**
 * Simple in-memory cache
 * key -> { data, expiry }
 */
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

const getCacheKey = (message) => {
  return crypto.createHash("sha256").update(message).digest("hex");
};

const getFromCache = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }

  return entry.data;
};

const setCache = (key, data) => {
  cache.set(key, {
    data,
    expiry: Date.now() + CACHE_TTL,
  });
};

/**
 * Robust JSON extractor
 */
const parseProducts = (rawText) => {
  if (!rawText) return null;

  // Try direct parse
  try {
    return JSON.parse(rawText);
  } catch {}

  // Extract largest JSON object
  const matches = rawText.match(/\{[\s\S]*\}/g);
  if (!matches) return null;

  for (const m of matches.reverse()) {
    try {
      return JSON.parse(m);
    } catch {}
  }

  return null;
};

/**
 * Validate & sanitize products
 */
const validateProducts = (products) => {
  if (!Array.isArray(products)) return [];

  return products
    .filter((p) => p && typeof p === "object")
    .map((p) => ({
      title: typeof p.title === "string" ? p.title.slice(0, 300) : "",
      price: typeof p.price === "number" ? p.price : 0,
      currency: "INR",
      image_url: typeof p.image_url === "string" ? p.image_url : "",
      product_url: typeof p.product_url === "string" ? p.product_url : "",
      platform: p.platform || "amazon",
      description:
        typeof p.description === "string" ? p.description.slice(0, 500) : "",
    }))
    .filter((p) => p.title && p.product_url);
};

router.post("/", chatLimiter, async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ products: [] });
  }

  const trimmed = message.trim().slice(0, 500);
  const cacheKey = getCacheKey(trimmed);

  // ✅ Serve from cache if available
  const cached = getFromCache(cacheKey);
  if (cached) {
    return res.json({ products: cached, cached: true });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5.4",
        tools: [{ type: "web_search_preview" }],
        temperature: 0, // 🔥 critical for consistency
        top_p: 1,
        max_output_tokens: 4000,
        input: [
          { role: "system", content: PRODUCT_SYSTEM_PROMPT },
          { role: "user", content: trimmed },
        ],
      }),
    });

    const data = await response.json();
    console.log("OpenAI raw response:", JSON.stringify(data, null, 2));
    if (data.error) {
      console.error("OpenAI error:", data.error);
      return res.status(502).json({ products: [] });
    }

    let rawText = "";

    for (const item of data.output ?? []) {
      if (item.type === "message") {
        for (const c of item.content ?? []) {
          if (c.type === "output_text") rawText += c.text;
        }
      }
    }

    const parsed = parseProducts(rawText);
    const validated = validateProducts(parsed?.products);

    // ✅ Cache only if meaningful
    if (validated.length > 0) {
      setCache(cacheKey, validated);
    }

    return res.json({
      products: validated,
      cached: false,
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.json({ products: [] });
  }
});

export default router;
