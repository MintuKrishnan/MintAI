import { useCallback, useEffect, useState } from 'react'
import { CHAT_KEY, MODE_KEY, SHOP_KEY, THEME_KEY } from '../constants/config'
import { THEMES } from '../constants/themes'
import { loadHistory, makeId, newChat } from '../utils/storage'

export const useHistory = () => {
  const [chatHistory,   setChatHistory]   = useState(() => loadHistory(CHAT_KEY, 'chat'))
  const [shopHistory,   setShopHistory]   = useState(() => loadHistory(SHOP_KEY, 'product'))
  const [chatActiveId,  setChatActiveId]  = useState(() => loadHistory(CHAT_KEY, 'chat')[0]?.id ?? '')
  const [shopActiveId,  setShopActiveId]  = useState(() => loadHistory(SHOP_KEY, 'product')[0]?.id ?? '')
  const [themeId,       setThemeId]       = useState(() => localStorage.getItem(THEME_KEY) || 'forest')
  const [mode,          setMode]          = useState(() => localStorage.getItem(MODE_KEY) || 'chat')

  const isShop   = mode === 'product'
  const chats    = isShop ? shopHistory  : chatHistory
  const activeId = isShop ? shopActiveId : chatActiveId
  const theme    = THEMES.find(t => t.id === themeId) ?? THEMES[0]
  const activeChat = chats.find(c => c.id === activeId) ?? chats[0]

  useEffect(() => { localStorage.setItem(CHAT_KEY,  JSON.stringify(chatHistory)) }, [chatHistory])
  useEffect(() => { localStorage.setItem(SHOP_KEY,  JSON.stringify(shopHistory)) }, [shopHistory])
  useEffect(() => { localStorage.setItem(THEME_KEY, themeId) }, [themeId])
  useEffect(() => { localStorage.setItem(MODE_KEY,  mode) },    [mode])

  // Functional updater so callers get the latest messages array
  const updateActiveChat = useCallback((updater) => {
    if (isShop) {
      setShopHistory(prev => prev.map(c => c.id === shopActiveId ? updater(c) : c))
    } else {
      setChatHistory(prev => prev.map(c => c.id === chatActiveId ? updater(c) : c))
    }
  }, [isShop, shopActiveId, chatActiveId])

  const appendMessage = useCallback((msg) => {
    updateActiveChat(c => ({ ...c, messages: [...c.messages, { id: makeId(), ...msg }] }))
  }, [updateActiveChat])

  const setTitle = useCallback((text) => {
    updateActiveChat(c =>
      c.title !== 'New Chat' ? c : {
        ...c,
        title: text.slice(0, 32) + (text.length > 32 ? '…' : ''),
      }
    )
  }, [updateActiveChat])

  const handleNewChat = useCallback(() => {
    const chat = newChat(mode)
    if (isShop) { setShopHistory(prev => [chat, ...prev]); setShopActiveId(chat.id) }
    else        { setChatHistory(prev => [chat, ...prev]); setChatActiveId(chat.id) }
  }, [mode, isShop])

  const handleSelectChat = useCallback((id) => {
    if (isShop) setShopActiveId(id)
    else        setChatActiveId(id)
  }, [isShop])

  const handleDeleteChat = useCallback((id) => {
    const setter   = isShop ? setShopHistory   : setChatHistory
    const idSetter = isShop ? setShopActiveId  : setChatActiveId
    const curId    = isShop ? shopActiveId     : chatActiveId

    setter(prev => {
      const next = prev.filter(c => c.id !== id)
      if (next.length === 0) {
        const fresh = newChat(mode)
        idSetter(fresh.id)
        return [fresh]
      }
      if (curId === id) idSetter(next[0].id)
      return next
    })
  }, [isShop, shopActiveId, chatActiveId, mode])

  return {
    chats, activeId, activeChat,
    theme, themeId, setThemeId,
    mode, setMode, isShop,
    appendMessage, setTitle,
    handleNewChat, handleSelectChat, handleDeleteChat,
  }
}
