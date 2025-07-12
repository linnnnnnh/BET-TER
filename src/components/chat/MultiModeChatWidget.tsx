import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, X, Send, Loader2, RotateCcw, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChatWebSocket, ChatMessage } from '@/hooks/useChatWebSocket'
import { WS_ENDPOINTS, CHAT_CONFIG, PSG_COLORS } from '@/config'
import { useChatContext } from '@/providers/ChatProvider'

// Define the chat modes
type ChatMode = 'general' | 'course' | 'evaluation';

interface ChatModeOption {
  id: ChatMode;
  title: string;
  description: string;
  icon: React.ReactNode;
  endpoint: string;
  welcomeMessage: string;
}

const chatModes: ChatModeOption[] = [
  {
    id: 'general',
    title: 'General Assistant',
    description: 'Ask about PSG, players, and match predictions',
    icon: <MessageCircle className="w-6 h-6" />,
    endpoint: WS_ENDPOINTS.CHAT,
    welcomeMessage: "Hi! I'm your PSG assistant. How can I help you with match predictions and team information today?"
  },
  {
    id: 'course',
    title: 'Football Knowledge',
    description: 'Learn about football rules, history, and strategies',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>,
    endpoint: WS_ENDPOINTS.COURSE,
    welcomeMessage: "Welcome to Football Knowledge! I can help you learn about football rules, PSG history, and game strategies. What would you like to explore?"
  },
  {
    id: 'evaluation',
    title: 'Test Your Knowledge',
    description: 'Quiz yourself on PSG and football facts',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
    endpoint: WS_ENDPOINTS.EVALUATION,
    welcomeMessage: "Ready to test your PSG knowledge? I'll ask you questions about the team, players, and football. Let me know when you're ready to begin!"
  }
];

export const MultiModeChatWidget = () => {
  const { isChatOpen, setIsChatOpen } = useChatContext()
  const [selectedMode, setSelectedMode] = useState<ChatMode | null>(null)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([])
  
  // WebSocket hook with dynamic URL based on selected mode
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
    url: selectedMode ? chatModes.find(mode => mode.id === selectedMode)?.endpoint || WS_ENDPOINTS.CHAT : WS_ENDPOINTS.CHAT,
    reconnectAttempts: CHAT_CONFIG.RECONNECT_ATTEMPTS,
    reconnectInterval: CHAT_CONFIG.RECONNECT_INTERVAL,
    onConnect: () => {
      console.log(`Connected to WebSocket: ${selectedMode ? chatModes.find(mode => mode.id === selectedMode)?.endpoint : 'none'}`);
      if (selectedMode) {
        // Add welcome message when connection is established
        setTimeout(() => {
          const welcomeMessage = chatModes.find(mode => mode.id === selectedMode)?.welcomeMessage || CHAT_CONFIG.WELCOME_MESSAGE;
          const message: ChatMessage = {
            id: Date.now().toString(),
            text: welcomeMessage,
            isUser: false,
            timestamp: new Date()
          }
          setLocalMessages(prev => [...prev, message])
        }, 300)
      }
    },
    onDisconnect: () => {
      console.log(`Disconnected from WebSocket: ${selectedMode ? chatModes.find(mode => mode.id === selectedMode)?.endpoint : 'none'}`);
    },
    onError: (error) => {
      console.error(`WebSocket error:`, error);
    }
  })
  
  // Connect when chat is opened and mode is selected
  useEffect(() => {
    if (isChatOpen && selectedMode && !isConnected && !isConnecting) {
      console.log(`Attempting to connect to: ${chatModes.find(mode => mode.id === selectedMode)?.endpoint}`);
      connect()
    }
  }, [isChatOpen, selectedMode, isConnected, isConnecting, connect])
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages, localMessages])
  
  const handleSendMessage = () => {
    if (!inputValue.trim() || !isConnected || isLoading) {
      console.log(`Cannot send message. Connected: ${isConnected}, Loading: ${isLoading}, Input empty: ${!inputValue.trim()}`);
      return;
    }
    
    console.log(`Sending message: "${inputValue}" to ${selectedMode} mode`);
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
  
  const handleModeSelect = (mode: ChatMode) => {
    setSelectedMode(mode)
    setLocalMessages([])
    if (isConnected) {
      disconnect()
    }
  }
  
  const handleBackToMenu = () => {
    setSelectedMode(null)
    setLocalMessages([])
    if (isConnected) {
      disconnect()
    }
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
                  <h3 className="font-semibold">
                    {selectedMode 
                      ? chatModes.find(mode => mode.id === selectedMode)?.title || 'PSG Assistant'
                      : 'PSG Assistant'}
                  </h3>
                  <p className="text-xs opacity-90">
                    {selectedMode 
                      ? 'Ask me anything about PSG'
                      : 'Select a chat mode'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-1">
                {selectedMode && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleBackToMenu}
                    className="hover:bg-blue-600 text-white"
                    title="Back to menu"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
                {selectedMode && (
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
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setIsChatOpen(false)
                    disconnect()
                    setSelectedMode(null)
                  }}
                  className="hover:bg-blue-600 text-white"
                  title="Close chat"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {/* Chat Content */}
            {!selectedMode ? (
              // Mode Selection Menu
              <div className="flex-1 p-4 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4 text-center">Choose a Chat Mode</h3>
                <div className="space-y-3">
                  {chatModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => handleModeSelect(mode.id)}
                      className="w-full p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-left flex items-center space-x-3"
                    >
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-700 dark:text-blue-300">
                        {mode.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{mode.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{mode.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Chat Messages
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
                      <p className="font-medium mb-1">
                        {chatModes.find(mode => mode.id === selectedMode)?.title || 'PSG Assistant'}
                      </p>
                      <p className="text-sm">Ask me anything about Paris Saint-Germain, match schedules, player stats, or general football questions.</p>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
            
            {/* Input Area - Only show when a mode is selected */}
            {selectedMode && (
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
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MultiModeChatWidget 