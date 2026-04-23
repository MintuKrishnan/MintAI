import dotenv from 'dotenv'
dotenv.config()

const config = {
  port:         Number(process.env.PORT) || 5001,
  openaiKey:    process.env.OPENAI_KEY    ?? '',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5174',
}

if (!config.openaiKey) {
  console.warn('Warning: OPENAI_KEY is not set. AI routes will fail.')
}

export default config
