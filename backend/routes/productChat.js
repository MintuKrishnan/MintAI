import { Router } from "express";
import crypto from "crypto";
import { chatLimiter } from "../middleware/rateLimiter.js";
import { openaiProductSearch } from "../services/openai.js";
import { geminiProductSearch } from "../services/gemini.js";

const router = Router();

const cache = new Map();
const CACHE_TTL = 1000 * 60 * 10;

const getCacheKey = (msg, provider) =>
  crypto.createHash("sha256").update(`${provider}:${msg}`).digest("hex");
const getFromCache = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data;
};
const setCache = (key, data) =>
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL });

const parseProducts = (rawText) => {
  if (!rawText) return null;
  try {
    return JSON.parse(rawText);
  } catch {}
  const matches = rawText.match(/\{[\s\S]*\}/g);
  if (!matches) return null;
  for (const m of matches.reverse()) {
    try {
      return JSON.parse(m);
    } catch {}
  }
  return null;
};

const validateProducts = (products) => {
  if (!Array.isArray(products)) return [];
  return products
    .filter((p) => p && typeof p === "object")
    .map((p) => ({
      title: typeof p.title === "string" ? p.title.slice(0, 300) : "",
      price: typeof p.price === "number" ? p.price : 0,
      currency: typeof p.currency === "string" ? p.currency.slice(0, 10) : "",
      image_url: typeof p.image_url === "string" ? p.image_url : "",
      product_url: typeof p.product_url === "string" ? p.product_url : "",
      platform: p.platform,
      description:
        typeof p.description === "string" ? p.description.slice(0, 500) : "",
    }))
    .filter((p) => p.title && p.product_url);
};

router.post("/", chatLimiter, async (req, res) => {
  const { message, provider = "openai" } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ products: [] });
  }

  const trimmed = message.trim().slice(0, 500);
  const cacheKey = getCacheKey(trimmed, provider);

  const cached = getFromCache(cacheKey);
  if (cached) return res.json({ products: cached, cached: true });

  try {
    const rawText =
      provider === "gemini"
        ? await geminiProductSearch(trimmed)
        : await openaiProductSearch(trimmed);

    const parsed = parseProducts(rawText);
    const validated = validateProducts(parsed?.products);

    if (validated.length > 0) setCache(cacheKey, validated);

    return res.json({ products: validated, cached: false });
  } catch (err) {
    console.error(`[product-chat] ${provider} error:`, err.message);
    return res.json({ products: [] });
  }
});

export default router;
