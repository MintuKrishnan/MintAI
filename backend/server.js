import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json({ limit: "16kb" }));

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { reply: "Too many requests. Please wait a moment." },
});

app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/chat", chatLimiter, async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ reply: "Message is required." });
  }

  const trimmed = message.trim().slice(0, 4000);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        input: trimmed,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI error:", data.error.message);
      return res
        .status(502)
        .json({ reply: "AI service error. Please try again." });
    }

    const replyText =
      data.output?.[0]?.content?.[0]?.text || "No response from model";

    res.json({ reply: replyText });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ reply: "Something went wrong. Please try again." });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Mint AI backend running on port ${PORT}`);
});
