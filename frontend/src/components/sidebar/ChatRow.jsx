import { useState } from 'react'

const ChatRow = ({ chat, isActive, onSelect, onDelete, theme }) => {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="relative group">
      <button
        onClick={onSelect}
        className="w-full text-left px-3 py-2 rounded-xl text-xs transition-all truncate pr-8"
        style={{
          background: isActive ? theme.accent + '18' : 'transparent',
          color:      isActive ? theme.accent         : theme.textSub,
          border:     isActive ? `1px solid ${theme.accent}30` : '1px solid transparent',
        }}
      >
        <span className="flex items-center gap-2">
          <svg
            width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="flex-shrink-0 opacity-50"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="truncate">{chat.title}</span>
        </span>
      </button>

      {confirming ? (
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button
            onClick={() => { onDelete(); setConfirming(false) }}
            className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[9px] font-bold"
            style={{ background: '#ef4444' }}
          >✓</button>
          <button
            onClick={() => setConfirming(false)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold"
            style={{ background: theme.border, color: theme.text }}
          >✕</button>
        </div>
      ) : (
        <button
          onClick={e => { e.stopPropagation(); setConfirming(true) }}
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: theme.textMuted }}
        >
          <svg
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6m4-6v6" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default ChatRow
