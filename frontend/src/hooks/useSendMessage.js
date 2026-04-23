import { useState } from 'react'
import { API_URL } from '../constants/config'

export const useSendMessage = ({ isShop, provider, appendMessage, setTitle }) => {
  const [loading, setLoading] = useState(false)

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return

    setTitle(text)
    appendMessage({ from: 'user', text })

    setLoading(true)
    const endpoint = isShop ? `${API_URL}/product-chat` : `${API_URL}/chat`

    try {
      const res  = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, provider }),
      })
      const data = await res.json()

      if (isShop) {
        appendMessage({ from: 'bot', products: data.products ?? [] })
      } else {
        appendMessage({ from: 'bot', text: data.reply ?? 'No response.' })
      }
    } catch {
      appendMessage({ from: 'bot', text: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return { loading, sendMessage }
}
