'use client'

import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Chat, Message } from '../types/chat'
import { saveChats, loadChats, saveActiveChat, loadActiveChat, generateChatTitle } from '../utils/storage'
import Sidebar from './Sidebar'
import ChatArea from './ChatArea'
import InputArea from './InputArea'
import styles from './ChatInterface.module.css'

export default function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [currentMessages, setCurrentMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Load chats from localStorage on mount
  useEffect(() => {
    const loadedChats = loadChats()
    setChats(loadedChats)

    const activeChatId = loadActiveChat()
    if (activeChatId && loadedChats.find(c => c.id === activeChatId)) {
      setActiveChat(activeChatId)
      const chat = loadedChats.find(c => c.id === activeChatId)
      if (chat) {
        setCurrentMessages(chat.messages)
      }
    }
  }, [])

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      saveChats(chats)
    }
  }, [chats])

  // Save active chat whenever it changes
  useEffect(() => {
    saveActiveChat(activeChat)
  }, [activeChat])

  const createNewChat = useCallback(() => {
    const newChatId = uuidv4()
    setActiveChat(newChatId)
    setCurrentMessages([])
    setIsSidebarOpen(false)
  }, [])

  const selectChat = useCallback((chatId: string) => {
    const chat = chats.find(c => c.id === chatId)
    if (chat) {
      setActiveChat(chatId)
      setCurrentMessages(chat.messages)
      setIsSidebarOpen(false)
    }
  }, [chats])

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId))
    if (activeChat === chatId) {
      setActiveChat(null)
      setCurrentMessages([])
    }
  }, [activeChat])

  const simulateAssistantResponse = (userMessage: string): string => {
    // Simple mock responses
    const responses = [
      "I understand your question. Let me help you with that.",
      "That's an interesting point. Here's what I think...",
      "Great question! Based on what you've asked, I would say...",
      "I can help you with that. Let me explain...",
      "Thank you for your message. Here's my response...",
    ]

    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      return "Hello! How can I assist you today?"
    }

    if (userMessage.toLowerCase().includes('how are you')) {
      return "I'm doing well, thank you for asking! How can I help you today?"
    }

    if (userMessage.toLowerCase().includes('what') && userMessage.toLowerCase().includes('?')) {
      return "That's a great question! " + responses[Math.floor(Math.random() * responses.length)]
    }

    return responses[Math.floor(Math.random() * responses.length)] + " I'm a demo assistant, so my responses are simulated. In a real implementation, this would connect to an AI API."
  }

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    }

    const newMessages = [...currentMessages, userMessage]
    setCurrentMessages(newMessages)

    // Simulate typing
    setIsTyping(true)

    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: simulateAssistantResponse(content),
        timestamp: new Date().toISOString()
      }

      const messagesWithResponse = [...newMessages, assistantMessage]
      setCurrentMessages(messagesWithResponse)
      setIsTyping(false)

      // Save or update chat
      if (activeChat) {
        setChats(prev => {
          const existingChat = prev.find(c => c.id === activeChat)
          if (existingChat) {
            return prev.map(c =>
              c.id === activeChat
                ? { ...c, messages: messagesWithResponse, timestamp: new Date().toISOString() }
                : c
            )
          } else {
            return [...prev, {
              id: activeChat,
              title: generateChatTitle(content),
              messages: messagesWithResponse,
              timestamp: new Date().toISOString()
            }]
          }
        })
      } else {
        const newChatId = uuidv4()
        const newChat: Chat = {
          id: newChatId,
          title: generateChatTitle(content),
          messages: messagesWithResponse,
          timestamp: new Date().toISOString()
        }
        setChats(prev => [...prev, newChat])
        setActiveChat(newChatId)
      }
    }, 1000 + Math.random() * 1000)
  }, [currentMessages, activeChat])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSidebarOpen(true)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        createNewChat()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [createNewChat])

  return (
    <div className={styles.container}>
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onNewChat={createNewChat}
        onSelectChat={selectChat}
        onDeleteChat={deleteChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className={styles.mainContent}>
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <ChatArea messages={currentMessages} isTyping={isTyping} />
        <InputArea onSend={sendMessage} disabled={isTyping} />
      </div>
    </div>
  )
}
