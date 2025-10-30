'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import styles from './InputArea.module.css'

interface InputAreaProps {
  onSend: (message: string) => void
  disabled?: boolean
}

const EMOJIS = ['😊', '😂', '❤️', '👍', '🤔', '😎', '🎉', '🔥', '✨', '💡', '🚀', '👀']

export default function InputArea({ onSend, disabled }: InputAreaProps) {
  const [message, setMessage] = useState('')
  const [showEmojis, setShowEmojis] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message)
      setMessage('')
      setShowEmojis(false)
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'
  }

  const insertEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji)
    setShowEmojis(false)
    textareaRef.current?.focus()
  }

  return (
    <div className={styles.inputArea}>
      <div className={styles.inputContainer}>
        {showEmojis && (
          <div className={styles.emojiPicker}>
            {EMOJIS.map(emoji => (
              <button
                key={emoji}
                className={styles.emojiButton}
                onClick={() => insertEmoji(emoji)}
                type="button"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        <div className={styles.inputWrapper}>
          <button
            className={styles.emojiToggle}
            onClick={() => setShowEmojis(!showEmojis)}
            type="button"
            aria-label="Toggle emoji picker"
            disabled={disabled}
          >
            😊
          </button>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            placeholder="Send a message..."
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={disabled}
          />
          <button
            className={styles.sendButton}
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            aria-label="Send message"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
