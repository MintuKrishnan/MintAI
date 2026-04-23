export const makeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2)

export const newChat = (mode = 'chat') => ({
  id: makeId(),
  title: 'New Chat',
  createdAt: Date.now(),
  messages: [{
    id: makeId(),
    from: 'bot',
    text: mode === 'product'
      ? "Hi! 🛍 Tell me what you're looking for — I'll search the web for real products!"
      : "Hello! I'm Mint 🌿 How can I help you today?",
  }],
})

export const loadHistory = (key, mode) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? '')
    if (Array.isArray(parsed) && parsed.length) return parsed
  } catch { /* ignore */ }
  return [newChat(mode)]
}
