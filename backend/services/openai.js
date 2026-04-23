import config from '../config/index.js'
import { PRODUCT_SYSTEM_PROMPT } from '../prompts/productSearch.js'

const RESPONSES_URL = 'https://api.openai.com/v1/responses'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${config.openaiKey}`,
})

export const openaiChat = async (message) => {
  const res = await fetch(RESPONSES_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ model: config.openaiChatModel, input: message }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.output?.[0]?.content?.[0]?.text ?? 'No response from model'
}

export const openaiProductSearch = async (message) => {
  const res = await fetch(RESPONSES_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      model: config.openaiSearchModel,
      tools: [{ type: 'web_search_preview' }],
      temperature: 0,
      top_p: 1,
      max_output_tokens: 4000,
      input: [
        { role: 'system', content: PRODUCT_SYSTEM_PROMPT },
        { role: 'user',   content: message },
      ],
    }),
  })
  const data = await res.json()
  if (data.error) throw new Error(JSON.stringify(data.error))

  let rawText = ''
  for (const item of data.output ?? []) {
    if (item.type === 'message') {
      for (const c of item.content ?? []) {
        if (c.type === 'output_text') rawText += c.text
      }
    }
  }
  return rawText
}
