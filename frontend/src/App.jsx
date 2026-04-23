import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import Markdown from 'react-markdown'

const STORAGE_KEY = 'mint_chats'
const THEME_KEY   = 'mint_theme'
const API_URL     = import.meta.env.VITE_API_URL || 'http://localhost:5001'

const THEMES = [
  { id: 'forest',   label: 'Forest',   bg: '#0a130e', surface: '#111f15', border: '#1a3a20' },
  { id: 'midnight', label: 'Midnight', bg: '#0d1117', surface: '#161b22', border: '#21262d' },
  { id: 'ocean',    label: 'Ocean',    bg: '#080f1a', surface: '#0e1929', border: '#1a2e45' },
  { id: 'charcoal', label: 'Charcoal', bg: '#111318', surface: '#1c1e24', border: '#2a2d35' },
  { id: 'mocha',    label: 'Mocha',    bg: '#120f0a', surface: '#1e1810', border: '#3a2e1e' },
]

const makeId  = () => Date.now().toString(36) + Math.random().toString(36).slice(2)
const newChat = () => ({
  id: makeId(),
  title: 'New Chat',
  createdAt: Date.now(),
  messages: [{ id: makeId(), from: 'bot', text: "Hello! I'm Mint 🌿 How can I help you today?" }],
})

const loadChats = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (Array.isArray(parsed) && parsed.length) return parsed
  } catch { /* ignore */ }
  const initial = newChat()
  return [initial]
}

const LeafIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22c0 0 4-8 10-10S22 2 22 2c0 0-2 8-8 10S2 22 2 22z" fill="currentColor" opacity="0.9"/>
    <path d="M2 22 L12 12" strokeWidth="1.5"/>
  </svg>
)

const BotAvatar = () => (
  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md text-white flex-shrink-0">
    <LeafIcon size={15} />
  </div>
)

const TypingLeaves = () => (
  <div className="flex items-center gap-1.5 px-4 py-3">
    {[0, 160, 320].map(d => (
      <span key={d} className="text-emerald-400 leaf-drift" style={{ animationDelay: `${d}ms` }}>
        <LeafIcon size={11} />
      </span>
    ))}
  </div>
)

const App = () => {
  const [chats,       setChats]       = useState(loadChats)
  const [activeId,    setActiveId]    = useState(() => loadChats()[0]?.id ?? '')
  const [input,       setInput]       = useState('')
  const [loading,     setLoading]     = useState(false)
  const [themeId,     setThemeId]     = useState(() => localStorage.getItem(THEME_KEY) || 'forest')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [deletingId,  setDeletingId]  = useState(null)
  const chatEndRef  = useRef(null)
  const textareaRef = useRef(null)

  const theme       = THEMES.find(t => t.id === themeId)
  const activeChat  = chats.find(c => c.id === activeId) ?? chats[0]
  const messages    = useMemo(() => activeChat?.messages ?? [], [activeChat])

  // Persist chats
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
  }, [chats])

  // Persist theme
  useEffect(() => {
    localStorage.setItem(THEME_KEY, themeId)
  }, [themeId])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const updateActiveChat = useCallback((updater) => {
    setChats(prev => prev.map(c => c.id === activeId ? updater(c) : c))
  }, [activeId])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userText = input.trim()
    const userMsg  = { id: makeId(), from: 'user', text: userText }

    updateActiveChat(c => ({
      ...c,
      title: c.title === 'New Chat' ? userText.slice(0, 32) + (userText.length > 32 ? '…' : '') : c.title,
      messages: [...c.messages, userMsg],
    }))
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = '24px'
    setLoading(true)

    try {
      const res  = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      })
      const data = await res.json()
      updateActiveChat(c => ({ ...c, messages: [...c.messages, { id: makeId(), from: 'bot', text: data.reply }] }))
    } catch {
      updateActiveChat(c => ({ ...c, messages: [...c.messages, { id: makeId(), from: 'bot', text: 'Something went wrong. Please try again.' }] }))
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = () => {
    const chat = newChat()
    setChats(prev => [chat, ...prev])
    setActiveId(chat.id)
    setInput('')
  }

  const handleDeleteChat = (id) => {
    setChats(prev => {
      const next = prev.filter(c => c.id !== id)
      if (next.length === 0) {
        const fresh = newChat()
        setActiveId(fresh.id)
        return [fresh]
      }
      if (activeId === id) setActiveId(next[0].id)
      return next
    })
    setDeletingId(null)
  }

  const handleSelectChat = (id) => {
    setActiveId(id)
    setInput('')
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden transition-colors duration-500" style={{ background: theme.bg }}>

      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col flex-shrink-0 transition-all duration-300 border-r overflow-hidden"
        style={{
          width: sidebarOpen ? '240px' : '0px',
          borderColor: theme.border,
          background: theme.surface,
        }}
      >
        <div className="flex flex-col h-full min-w-[240px]">
          {/* Sidebar header */}
          <div className="flex items-center gap-2 px-3 pt-4 pb-3" style={{ borderBottom: `1px solid ${theme.border}` }}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <LeafIcon size={13} />
            </div>
            <span className="text-emerald-100 font-bold text-sm tracking-tight flex-1">Mint AI</span>
          </div>

          {/* New chat button */}
          <div className="px-2 py-2">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-emerald-300 border border-emerald-900/60 hover:border-emerald-500/40 hover:bg-emerald-900/20 transition-all"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Chat
            </button>
          </div>

          {/* Chat list */}
          <div className="flex-1 overflow-y-auto px-2 space-y-0.5 py-1">
            {chats.map(chat => (
              <div key={chat.id} className="relative group">
                <button
                  onClick={() => handleSelectChat(chat.id)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs transition-all truncate pr-8"
                  style={{
                    background: activeId === chat.id ? theme.border : 'transparent',
                    color: activeId === chat.id ? '#d1fae5' : '#4b7a5c',
                  }}
                >
                  <span className="flex items-center gap-2">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 opacity-60">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span className="truncate">{chat.title}</span>
                  </span>
                </button>

                {/* Delete button */}
                {deletingId === chat.id ? (
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      onClick={() => handleDeleteChat(chat.id)}
                      title="Confirm delete"
                      className="w-6 h-6 rounded-md flex items-center justify-center bg-red-500 text-white hover:bg-red-400 transition-all shadow-sm"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6m4-6v6"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      title="Cancel"
                      className="w-6 h-6 rounded-md flex items-center justify-center bg-emerald-700 text-white hover:bg-emerald-600 transition-all shadow-sm"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeletingId(chat.id) }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-800 hover:text-red-400"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6m4-6v6"/>
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Theme picker */}
          <div className="px-3 py-3" style={{ borderTop: `1px solid ${theme.border}` }}>
            <p className="text-[10px] text-emerald-900 mb-2 uppercase tracking-widest">Theme</p>
            <div className="flex items-center gap-2">
              {THEMES.map(t => {
                const isActive = themeId === t.id
                return (
                  <button key={t.id} onClick={() => setThemeId(t.id)} title={t.label}
                    className="relative w-5 h-5 rounded-full border-2 transition-all hover:scale-110"
                    style={{
                      background: t.bg,
                      borderColor: isActive ? '#34d399' : t.border,
                      boxShadow: isActive ? '0 0 0 2px #34d39966' : 'none',
                    }}>
                    {isActive && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 border-b backdrop-blur-md flex-shrink-0 transition-colors duration-500"
          style={{ borderColor: theme.border, background: theme.bg + 'cc' }}>
          <button onClick={() => setSidebarOpen(v => !v)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-emerald-700 hover:text-emerald-300 hover:bg-emerald-900/30 transition-colors flex-shrink-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <span className="text-emerald-100/80 text-sm font-medium truncate flex-1">{activeChat?.title ?? 'Mint AI'}</span>
          <button onClick={handleNewChat}
            className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-300 px-3 py-1.5 rounded-lg hover:bg-emerald-900/30 transition-colors flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-6">
          <div className="w-full max-w-2xl mx-auto px-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id}
                className={`flex items-end gap-2.5 ${msg.from === 'user' ? 'flex-row-reverse msg-user' : 'flex-row msg-bot'}`}>
                {msg.from === 'bot' && <BotAvatar />}
                {msg.from === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-md">
                    M
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed transition-colors duration-500 ${
                    msg.from === 'user'
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-sm shadow-md'
                      : 'text-emerald-50/90 rounded-bl-sm shadow-md prose prose-sm prose-invert prose-emerald max-w-none'
                  }`}
                  style={msg.from === 'bot' ? { background: theme.surface, border: `1px solid ${theme.border}` } : {}}
                >
                  {msg.from === 'user' ? msg.text : <Markdown>{msg.text}</Markdown>}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-end gap-2.5 flex-row msg-bot">
                <BotAvatar />
                <div className="rounded-2xl rounded-bl-sm shadow-md sprout" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
                  <TypingLeaves />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="px-4 pb-5 pt-2 flex-shrink-0">
          <div className="w-full max-w-2xl mx-auto">
            <div className="flex items-end gap-2.5 rounded-2xl px-4 py-3 transition-all duration-500 focus-within:shadow-lg focus-within:shadow-emerald-900/20"
              style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
              <textarea ref={textareaRef} rows={1} value={input}
                onChange={e => {
                  setInput(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
                }}
                placeholder="Ask Mint anything..."
                className="flex-1 bg-transparent text-emerald-50/90 placeholder-emerald-800 text-sm resize-none outline-none leading-relaxed max-h-40 min-h-[24px]"
                style={{ height: '24px' }}
              />
              <button onClick={sendMessage} disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-600 text-white transition-all hover:opacity-90 hover:scale-105 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
            <p className="text-center text-emerald-900 text-xs mt-2">Mint can make mistakes — always double-check important info.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
