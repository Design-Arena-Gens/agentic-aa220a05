'use client'

import { useEffect, useRef } from 'react'
import { Message } from '../types/chat'
import styles from './ChatArea.module.css'

interface ChatAreaProps {
  messages: Message[]
  isTyping: boolean
}

export default function ChatArea({ messages, isTyping }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={styles.chatArea}>
      {messages.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💬</div>
          <h2 className={styles.emptyTitle}>Start a conversation</h2>
          <p className={styles.emptyText}>Type a message below to begin</p>
        </div>
      )}
      <div className={styles.messages}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.messageWrapper} ${
              message.role === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper
            }`}
          >
            <div className={styles.messageContainer}>
              <div className={styles.messageAvatar}>
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className={styles.messageContent}>
                <div
                  className={`${styles.messageBubble} ${
                    message.role === 'user' ? styles.userMessage : styles.assistantMessage
                  }`}
                >
                  {message.content}
                </div>
                <div className={styles.timestamp}>{formatTime(message.timestamp)}</div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className={`${styles.messageWrapper} ${styles.assistantMessageWrapper}`}>
            <div className={styles.messageContainer}>
              <div className={styles.messageAvatar}>🤖</div>
              <div className={styles.messageContent}>
                <div className={`${styles.messageBubble} ${styles.assistantMessage}`}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
