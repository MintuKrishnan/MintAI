import { useState, useMemo } from 'react'
import { useHistory } from './hooks/useHistory'
import { useSendMessage } from './hooks/useSendMessage'
import Sidebar from './components/sidebar/Sidebar'
import MessageList from './components/chat/MessageList'
import InputBar from './components/chat/InputBar'
import LeafIcon from './components/ui/LeafIcon'

const Header = ({ theme, mode, isShop, activeTitle, onToggleSidebar, onNewChat }) => (
  <header
    className="flex items-center gap-3 px-4 py-3 border-b shrink-0"
    style={{ borderColor: theme.border, background: theme.surface }}
  >
    <button
      onClick={onToggleSidebar}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
      style={{ color: theme.textMuted }}
      onMouseEnter={e => e.currentTarget.style.color = theme.text}
      onMouseLeave={e => e.currentTarget.style.color = theme.textMuted}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="3" y1="6"  x2="21" y2="6"  />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>

    <span className="text-sm font-semibold truncate flex-1" style={{ color: theme.text }}>
      {activeTitle}
    </span>

    <span
      className="text-[11px] px-2.5 py-1 rounded-full font-semibold shrink-0"
      style={{ background: theme.accent + '18', color: theme.accent, border: `1px solid ${theme.accent}33` }}
    >
      {isShop ? '🛍 Shop' : '💬 Chat'}
    </span>

    <button
      onClick={onNewChat}
      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all shrink-0"
      style={{ color: theme.textMuted, border: `1px solid ${theme.border}` }}
      onMouseEnter={e => { e.currentTarget.style.color = theme.accent; e.currentTarget.style.borderColor = theme.accent }}
      onMouseLeave={e => { e.currentTarget.style.color = theme.textMuted; e.currentTarget.style.borderColor = theme.border }}
    >
      <LeafIcon size={11} />
      New
    </button>
  </header>
)

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const {
    chats, activeId, activeChat,
    theme, themeId, setThemeId,
    mode, setMode, isShop,
    appendMessage, setTitle,
    handleNewChat, handleSelectChat, handleDeleteChat,
  } = useHistory()

  const { loading, sendMessage } = useSendMessage({ isShop, appendMessage, setTitle })

  const messages = useMemo(() => activeChat?.messages ?? [], [activeChat])

  return (
    <div className="h-screen w-screen flex overflow-hidden" style={{ background: theme.bg }}>

      <Sidebar
        open={sidebarOpen}
        theme={theme} themeId={themeId} setThemeId={setThemeId}
        mode={mode} setMode={setMode} isShop={isShop}
        chats={chats} activeId={activeId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          theme={theme}
          mode={mode}
          isShop={isShop}
          activeTitle={activeChat?.title ?? 'Mint AI'}
          onToggleSidebar={() => setSidebarOpen(v => !v)}
          onNewChat={handleNewChat}
        />

        <MessageList messages={messages} loading={loading} theme={theme} />

        <InputBar theme={theme} isShop={isShop} sendMessage={sendMessage} loading={loading} />
      </div>

    </div>
  )
}

export default App
