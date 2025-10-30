export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  timestamp: string
}
