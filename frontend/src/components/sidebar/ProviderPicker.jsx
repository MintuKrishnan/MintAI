const PROVIDERS = [
  {
    id: 'openai',
    label: 'ChatGPT',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.28 9.28a5.76 5.76 0 0 0-.5-4.73 5.83 5.83 0 0 0-6.27-2.8A5.82 5.82 0 0 0 11.1 0a5.83 5.83 0 0 0-5.56 4.04 5.82 5.82 0 0 0-3.88 2.83 5.83 5.83 0 0 0 .72 6.84 5.76 5.76 0 0 0 .5 4.73 5.83 5.83 0 0 0 6.27 2.8A5.82 5.82 0 0 0 12.9 24a5.83 5.83 0 0 0 5.56-4.04 5.82 5.82 0 0 0 3.88-2.83 5.83 5.83 0 0 0-.72-6.84zm-8.7 12.16a4.32 4.32 0 0 1-2.77-1 .2.2 0 0 1 .04-.05l4.6-2.66a.38.38 0 0 0 .19-.33v-6.5l1.95 1.12a.04.04 0 0 1 .02.03v5.38a4.34 4.34 0 0 1-4.03 4.01zM3.55 17.62a4.32 4.32 0 0 1-.52-2.9l.07.04 4.6 2.66a.38.38 0 0 0 .38 0l5.62-3.25v2.24a.04.04 0 0 1-.02.03L9.1 19.12a4.34 4.34 0 0 1-5.55-1.5zM2.66 8.12a4.32 4.32 0 0 1 2.25-1.9v5.46a.38.38 0 0 0 .19.33l5.62 3.24-1.95 1.13a.04.04 0 0 1-.04 0L4.3 13.7a4.34 4.34 0 0 1-1.64-5.58zm15.7 3.73-5.62-3.25 1.95-1.12a.04.04 0 0 1 .04 0l4.43 2.56a4.34 4.34 0 0 1-.67 7.82v-5.46a.38.38 0 0 0-.13-.55zm1.94-2.94-.07-.04-4.6-2.65a.38.38 0 0 0-.38 0L9.63 9.47V7.23a.04.04 0 0 1 .02-.04l4.43-2.56a4.34 4.34 0 0 1 6.22 4.28zM8.54 12.85 6.6 11.73a.04.04 0 0 1-.02-.03V6.32a4.34 4.34 0 0 1 7.12-3.33.2.2 0 0 1-.04.05L9.06 5.7a.38.38 0 0 0-.19.33l-.03 6.49-.3.33zm1.06-2.28 2.5-1.44 2.5 1.44v2.87l-2.5 1.44-2.5-1.44v-2.87z"/>
      </svg>
    ),
  },
  {
    id: 'gemini',
    label: 'Gemini',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 24A14.44 14.44 0 0 1 0 12 14.44 14.44 0 0 1 12 0a14.44 14.44 0 0 1 12 12 14.44 14.44 0 0 1-12 12zm0-22.5C7.56 1.5 4.21 4.35 3.1 8.25h17.8C19.79 4.35 16.44 1.5 12 1.5zM1.5 12c0 .51.04 1 .1 1.5h20.8c.07-.5.1-1 .1-1.5s-.04-1-.1-1.5H1.6c-.07.5-.1.99-.1 1.5zm1.6 3c1.11 3.9 4.46 6.75 8.9 6.75s7.79-2.85 8.9-6.75H3.1z"/>
      </svg>
    ),
  },
]

const ProviderPicker = ({ provider, setProvider, theme }) => (
  <div className="px-4 py-3" style={{ borderTop: `1px solid ${theme.border}` }}>
    <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: theme.textMuted }}>
      AI Model
    </p>
    <div className="flex gap-2">
      {PROVIDERS.map(p => {
        const isActive = provider === p.id
        return (
          <button
            key={p.id}
            onClick={() => setProvider(p.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background:  isActive ? theme.accent + '18' : 'transparent',
              color:       isActive ? theme.accent        : theme.textMuted,
              border:      `1px solid ${isActive ? theme.accent + '55' : theme.border}`,
            }}
          >
            {p.icon}
            {p.label}
          </button>
        )
      })}
    </div>
  </div>
)

export default ProviderPicker
