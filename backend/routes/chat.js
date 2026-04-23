import { Router } from 'express'
import config from '../config/index.js'
import { chatLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.post('/', chatLimiter, async (req, res) => {
  const { message } = req.body

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ reply: 'Message is required.' })
  }

  const trimmed = message.trim().slice(0, 4000)

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        input: trimmed,
      }),
    })

    const data = await response.json()

    if (data.error) {
      console.error('OpenAI error:', data.error.message)
      return res.status(502).json({ reply: 'AI service error. Please try again.' })
    }

    const replyText = data.output?.[0]?.content?.[0]?.text ?? 'No response from model'
    return res.json({ reply: replyText })
  } catch (err) {
    console.error('Server error in /chat:', err)
    return res.status(500).json({ reply: 'Something went wrong. Please try again.' })
  }
})

export default router
