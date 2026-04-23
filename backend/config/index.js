import dotenv from 'dotenv'
dotenv.config()

const config = {
  port:              Number(process.env.PORT) || 5001,
  openaiKey:         process.env.OPENAI_KEY          ?? '',
  openaiChatModel:   process.env.OPENAI_CHAT_MODEL   ?? 'gpt-4.1',
  openaiSearchModel: process.env.OPENAI_SEARCH_MODEL ?? 'gpt-4.1',
  geminiKey:         process.env.GEMINI_KEY          ?? '',
  geminiModel:       process.env.GEMINI_MODEL        ?? 'gemini-flash-latest',
  clientOrigin:      process.env.CLIENT_ORIGIN       ?? 'http://localhost:5174',
}

if (!config.openaiKey) console.warn('Warning: OPENAI_KEY is not set.')
if (!config.geminiKey) console.warn('Warning: GEMINI_KEY is not set.')

export default config
