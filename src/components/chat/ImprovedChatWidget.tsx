import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, X, Send, Loader2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChatWebSocket, ChatMessage } from '@/hooks/useChatWebSocket'
import { WS_ENDPOINTS, CHAT_CONFIG } from '@/config'
import { useChatContext } from '@/providers/ChatProvider'

export const ImprovedChatWidget = () => {
  const { isChatOpen, setIsChatOpen } = useChatContext()
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Define setMessages with correct type for messages state
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([])
  
  const {
    connect,
    disconnect,
    sendMessage,
    clearChat,
    messages,
    isConnecting,
    isConnected,
    isLoading,
    isError
  } = useChatWebSocket({
    url: WS_ENDPOINTS.CHAT,
    reconnectAttempts: CHAT_CONFIG.RECONNECT_ATTEMPTS,
    reconnectInterval: CHAT_CONFIG.RECONNECT_INTERVAL,
    onConnect: () => {
      // Add welcome message when connection is established
      setTimeout(() => {
        const welcomeMessage: ChatMessage = {
          id: Date.now().toString(),
          text: CHAT_CONFIG.WELCOME_MESSAGE,
          isUser: false,
          timestamp: new Date()
        }
        setLocalMessages(prev => [...prev, welcomeMessage])
      }, 300)
    }
  })
  
  // Connect when chat is opened
  useEffect(() => {
    if (isChatOpen && !isConnected && !isConnecting) {
      connect()
    }
  }, [isChatOpen, isConnected, isConnecting, connect])
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const handleSendMessage = () => {
    if (!inputValue.trim() || !isConnected || isLoading) return
    
    sendMessage(inputValue)
    setInputValue('')
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  // Combine local welcome message with messages from hook
  const displayMessages = [...localMessages, ...messages]
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <Button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`rounded-full w-14 h-14 shadow-lg ${isChatOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-700 hover:bg-blue-800'}`}
        aria-label={isChatOpen ? "Close chat" : "Open chat"}
      >
        {isChatOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>
      
      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-80 sm:w-96 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-blue-700 p-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-700 font-bold text-sm">PSG</span>
                </div>
                <div>
                  <h3 className="font-semibold">PSG Assistant</h3>
                  <p className="text-xs opacity-90">Ask me anything about PSG</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    clearChat()
                    setLocalMessages([])
                  }}
                  className="hover:bg-blue-600 text-white"
                  title="Clear chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setIsChatOpen(false)
                    disconnect()
                  }}
                  className="hover:bg-blue-600 text-white"
                  title="Close chat"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isConnecting && (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center">
                    <Loader2 className="animate-spin h-8 w-8 mx-auto mb-2 text-blue-700" />
                    <p className="text-gray-500 dark:text-gray-400">Connecting...</p>
                  </div>
                </div>
              )}
              
              {isError && displayMessages.length === 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-red-600 dark:text-red-400 text-center">
                  <p>Connection error. Please try again later.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={connect}
                    className="mt-2 text-xs"
                  >
                    Retry Connection
                  </Button>
                </div>
              )}
              
              {displayMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser 
                        ? 'bg-blue-700 text-white rounded-br-none' 
                        : 'bg-gray-100 dark:bg-gray-700 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
                    <span className="text-xs opacity-70 block mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {displayMessages.length === 0 && !isConnecting && !isError && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500 dark:text-gray-400 px-6">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium mb-1">Welcome to PSG Assistant</p>
                    <p className="text-sm">Ask me anything about Paris Saint-Germain, match schedules, player stats, or general football questions.</p>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="p-4 border-t dark:border-gray-700">
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex items-center space-x-2"
              >
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={CHAT_CONFIG.PLACEHOLDER}
                  className="flex-1 border dark:border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:bg-gray-700 text-sm resize-none"
                  rows={1}
                  disabled={isLoading || isConnecting || isError || !isConnected}
                />
                <Button 
                  type="submit"
                  size="icon"
                  disabled={isLoading || isConnecting || !inputValue.trim() || isError || !isConnected}
                  className="bg-blue-700 hover:bg-blue-800"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ImprovedChatWidget 