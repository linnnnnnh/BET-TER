import { createContext, useContext, useState, ReactNode } from 'react'

interface ChatContextType {
  isChatOpen: boolean
  setIsChatOpen: (isOpen: boolean) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function useChatContext() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

interface ChatProviderProps {
  children: ReactNode
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  
  const value = {
    isChatOpen,
    setIsChatOpen
  }
  
  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider 