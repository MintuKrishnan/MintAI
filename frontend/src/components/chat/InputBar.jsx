import { useRef, useState } from 'react'

const SendIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const InputBar = ({ theme, isShop, sendMessage, loading }) => {
  const [input,    setInput]    = useState('')
  const textareaRef             = useRef(null)

  const handleSend = () => {
    const text = input.trim()
    if (!text || loading) return
    sendMessage(text)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = '24px'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleChange = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
  }

  return (
    <div className="px-4 pb-5 pt-2 flex-shrink-0">
      {/* Inject placeholder colour — can't be set via inline style */}
      <style>{`#mint-input::placeholder{color:${theme.textMuted};opacity:1}`}</style>

      <div className="w-full max-w-2xl mx-auto">
        <div
          className="flex items-end gap-3 rounded-2xl px-4 py-3"
          style={{
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.isDark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.07)',
          }}
        >
          <textarea
            id="mint-input"
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={isShop
              ? 'Search products (e.g. "fleece jacket from HH for Norway")…'
              : 'Ask Mint anything…'}
            className="flex-1 bg-transparent text-sm resize-none outline-none leading-relaxed max-h-40 min-h-[24px]"
            style={{ height: '24px', color: theme.text }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-all hover:opacity-90 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
            style={{ background: `linear-gradient(135deg,${theme.accent},${theme.accent}cc)` }}
          >
            {isShop ? <SearchIcon /> : <SendIcon />}
          </button>
        </div>

        <p className="text-center text-[11px] mt-2" style={{ color: theme.textMuted }}>
          {isShop
            ? 'Results are AI-generated — verify prices and availability on the platform.'
            : 'Mint can make mistakes — always double-check important info.'}
        </p>
      </div>
    </div>
  )
}

export default InputBar
