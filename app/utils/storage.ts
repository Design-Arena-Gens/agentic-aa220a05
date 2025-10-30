import { Chat, Message } from '../types/chat'

const STORAGE_KEY = 'chatgpt-history'
const ACTIVE_CHAT_KEY = 'chatgpt-active-chat'
const MAX_CHATS = 100

export const saveChats = (chats: Chat[]): void => {
  try {
    // Keep only the most recent chats if exceeding limit
    const chatsToSave = chats.slice(-MAX_CHATS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatsToSave))
  } catch (error) {
    // Handle quota exceeded
    console.error('Storage quota exceeded, removing oldest chats')
    if (chats.length > 10) {
      const reducedChats = chats.slice(-50)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedChats))
    }
  }
}

export const loadChats = (): Chat[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading chats:', error)
    return []
  }
}

export const saveActiveChat = (chatId: string | null): void => {
  if (chatId) {
    localStorage.setItem(ACTIVE_CHAT_KEY, chatId)
  } else {
    localStorage.removeItem(ACTIVE_CHAT_KEY)
  }
}

export const loadActiveChat = (): string | null => {
  return localStorage.getItem(ACTIVE_CHAT_KEY)
}

export const generateChatTitle = (firstMessage: string): string => {
  const maxLength = 50
  const trimmed = firstMessage.trim()
  return trimmed.length > maxLength
    ? trimmed.substring(0, maxLength) + '...'
    : trimmed
}
