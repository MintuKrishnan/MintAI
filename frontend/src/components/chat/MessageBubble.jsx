import Markdown from 'react-markdown'
import BotAvatar from '../ui/BotAvatar'
import ProductGrid from '../product/ProductGrid'

const UserAvatar = ({ accent }) => (
  <div
    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
    style={{ background: `linear-gradient(135deg,${accent},${accent}bb)` }}
  >
    M
  </div>
)

const MessageBubble = ({ msg, theme }) => {
  // Product search result — full-width grid
  if (msg.products !== undefined) {
    return (
      <div className="flex flex-col gap-2.5 msg-bot">
        <div className="flex items-center gap-2">
          <BotAvatar accent={theme.accent} />
          <span className="text-xs font-medium" style={{ color: theme.textSub }}>
            {msg.products.length > 0
              ? `Found ${msg.products.length} product${msg.products.length !== 1 ? 's' : ''}`
              : 'No products found'}
          </span>
        </div>
        <ProductGrid products={msg.products} theme={theme} />
      </div>
    )
  }

  const isUser = msg.from === 'user'

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse msg-user' : 'flex-row msg-bot'}`}>
      {isUser ? <UserAvatar accent={theme.accent} /> : <BotAvatar accent={theme.accent} />}

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'text-white rounded-br-sm'
            : `rounded-bl-sm prose prose-sm max-w-none ${theme.isDark ? 'prose-invert' : ''}`
        }`}
        style={
          isUser
            ? {
                background: `linear-gradient(135deg,${theme.accent},${theme.accent}cc)`,
                boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              }
            : {
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                color: theme.text,
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }
        }
      >
        {isUser ? msg.text : <Markdown>{msg.text}</Markdown>}
      </div>
    </div>
  )
}

export default MessageBubble
