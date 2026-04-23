import LeafIcon from '../ui/LeafIcon'
import ChatRow from './ChatRow'
import ModeToggle from './ModeToggle'
import ProviderPicker from './ProviderPicker'
import ThemePicker from './ThemePicker'

const Sidebar = ({
  open,
  theme, themeId, setThemeId,
  mode, setMode, isShop,
  provider, setProvider,
  chats, activeId,
  onSelectChat, onNewChat, onDeleteChat,
}) => (
  <aside
    className="flex flex-col shrink-0 transition-all duration-300 border-r overflow-hidden"
    style={{ width: open ? '260px' : '0px', borderColor: theme.border, background: theme.surface }}
  >
    <div className="flex flex-col h-full min-w-65">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4" style={{ borderBottom: `1px solid ${theme.border}` }}>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0"
          style={{ background: `linear-gradient(135deg,${theme.accent},${theme.accent}99)` }}
        >
          <LeafIcon size={14} />
        </div>
        <span className="font-bold text-sm tracking-tight" style={{ color: theme.text }}>Mint AI</span>
      </div>

      {/* Mode toggle */}
      <ModeToggle mode={mode} setMode={setMode} theme={theme} />

      {/* New chat button */}
      <div className="px-3 py-2">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all"
          style={{ border: `1px dashed ${theme.border}`, color: theme.textSub }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.accent }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textSub }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New {isShop ? 'Search' : 'Chat'}
        </button>
      </div>

      {/* History label */}
      <p className="px-4 pb-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: theme.textMuted }}>
        {isShop ? 'Shop History' : 'Chat History'}
      </p>

      {/* History list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
        {chats.map(chat => (
          <ChatRow
            key={chat.id}
            chat={chat}
            isActive={activeId === chat.id}
            onSelect={() => onSelectChat(chat.id)}
            onDelete={() => onDeleteChat(chat.id)}
            theme={theme}
          />
        ))}
      </div>

      {/* Provider picker */}
      <ProviderPicker provider={provider} setProvider={setProvider} theme={theme} />

      {/* Theme picker */}
      <ThemePicker themeId={themeId} setThemeId={setThemeId} theme={theme} />
    </div>
  </aside>
)

export default Sidebar
