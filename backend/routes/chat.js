import { Router } from 'express'
import { chatLimiter } from '../middleware/rateLimiter.js'
import { openaiChat } from '../services/openai.js'
import { geminiChat } from '../services/gemini.js'

const router = Router()

router.post('/', chatLimiter, async (req, res) => {
  const { message, provider = 'openai' } = req.body

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ reply: 'Message is required.' })
  }

  const trimmed = message.trim().slice(0, 4000)

  try {
    const reply = provider === 'gemini'
      ? await geminiChat(trimmed)
      : await openaiChat(trimmed)

    return res.json({ reply })
  } catch (err) {
    console.error(`[chat] ${provider} error:`, err.message)
    return res.status(502).json({ reply: 'AI service error. Please try again.' })
  }
})

export default router
