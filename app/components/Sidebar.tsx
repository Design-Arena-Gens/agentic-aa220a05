'use client'

import { useState, useMemo } from 'react'
import { Chat } from '../types/chat'
import styles from './Sidebar.module.css'

interface SidebarProps {
  chats: Chat[]
  activeChat: string | null
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({
  chats,
  activeChat,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  isOpen,
  onClose
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) {
      return [...chats].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    }
    return chats
      .filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
  }, [chats, searchQuery])

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={onClose}
      />
      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.header}>
          <button className={styles.newChatButton} onClick={onNewChat}>
            <span className={styles.plusIcon}>+</span>
            <span>New chat</span>
          </button>
        </div>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search chats... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.chatList}>
          {filteredChats.length === 0 && searchQuery && (
            <div className={styles.noResults}>No chats found</div>
          )}
          {filteredChats.length === 0 && !searchQuery && (
            <div className={styles.noResults}>No chat history yet</div>
          )}
          {filteredChats.map(chat => (
            <div
              key={chat.id}
              className={`${styles.chatItem} ${activeChat === chat.id ? styles.chatItemActive : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className={styles.chatItemContent}>
                <div className={styles.chatTitle}>{chat.title}</div>
                <div className={styles.chatTimestamp}>
                  {formatTimestamp(chat.timestamp)}
                </div>
              </div>
              <button
                className={styles.deleteButton}
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm('Delete this chat?')) {
                    onDeleteChat(chat.id)
                  }
                }}
                aria-label="Delete chat"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>👤</div>
            <div className={styles.userName}>User</div>
          </div>
        </div>
      </div>
    </>
  )
}
