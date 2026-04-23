const MODES = [
  { id: 'chat',    label: '💬 Chat' },
  { id: 'product', label: '🛍 Shop' },
]

const ModeToggle = ({ mode, setMode, theme }) => (
  <div className="px-3 pt-3 pb-1">
    <div
      className="flex rounded-xl p-0.5 gap-0.5"
      style={{ background: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
    >
      {MODES.map(m => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all"
          style={{
            background: mode === m.id ? theme.surface   : 'transparent',
            color:      mode === m.id ? theme.accent     : theme.textMuted,
            boxShadow:  mode === m.id ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
          }}
        >
          {m.label}
        </button>
      ))}
    </div>
  </div>
)

export default ModeToggle
