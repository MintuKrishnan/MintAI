import { useEffect, useRef } from 'react'
import BotAvatar from '../ui/BotAvatar'
import TypingDots from '../ui/TypingDots'
import MessageBubble from './MessageBubble'

const MessageList = ({ messages, loading, theme }) => {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="flex-1 overflow-y-auto py-6">
      <div className="w-full max-w-2xl mx-auto px-4 space-y-5">
        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} theme={theme} />
        ))}

        {loading && (
          <div className="flex items-end gap-2.5 msg-bot">
            <BotAvatar accent={theme.accent} />
            <div
              className="rounded-2xl rounded-bl-sm sprout"
              style={{
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              <TypingDots accent={theme.accent} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}

export default MessageList
