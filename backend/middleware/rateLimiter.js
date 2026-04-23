import rateLimit from 'express-rate-limit'

export const chatLimiter = rateLimit({
  windowMs:       60_000,
  max:            30,
  standardHeaders: true,
  legacyHeaders:  false,
  message:        { reply: 'Too many requests. Please wait a moment.' },
})
