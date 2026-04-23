import { THEMES } from '../../constants/themes'

const ThemePicker = ({ themeId, setThemeId, theme }) => (
  <div className="px-4 py-3" style={{ borderTop: `1px solid ${theme.border}` }}>
    <p
      className="text-[10px] font-semibold uppercase tracking-widest mb-2"
      style={{ color: theme.textMuted }}
    >
      Theme
    </p>
    <div className="flex items-center gap-2 flex-wrap">
      {THEMES.map(t => {
        const isActive = themeId === t.id
        return (
          <button
            key={t.id}
            onClick={() => setThemeId(t.id)}
            title={t.label}
            className="w-5 h-5 rounded-full border-2 transition-all hover:scale-110 active:scale-95 relative"
            style={{
              background:  t.isDark ? t.surface : t.bg,
              borderColor: isActive ? t.accent  : t.border,
              boxShadow:   isActive ? `0 0 0 2px ${t.accent}44` : 'none',
              outline:     `2px solid ${t.border}`,
            }}
          >
            {isActive && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  width="8" height="8" viewBox="0 0 24 24" fill="none"
                  stroke={t.accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
          </button>
        )
      })}
    </div>
  </div>
)

export default ThemePicker
