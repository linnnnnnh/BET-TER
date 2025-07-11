import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Connect to WebSocket when the chat is opened
  useEffect(() => {
    if (isOpen && !socket) {
      connectWebSocket()
    }
    
    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [isOpen])
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const connectWebSocket = () => {
    setIsConnecting(true)
    setIsError(false)
    
    const newSocket = new WebSocket('ws://localhost:8000/ws')
    
    newSocket.onopen = () => {
      setSocket(newSocket)
      setIsConnecting(false)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "Hi! I'm your PSG assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date()
      }])
    }
    
    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      if (data.text) {
        setMessages(prev => {
          // If the last message is from the bot and not finished, append to it
          const lastMessage = prev[prev.length - 1]
          if (!lastMessage?.isUser && !data.done) {
            const updatedMessages = [...prev]
            updatedMessages[prev.length - 1] = {
              ...lastMessage,
              text: lastMessage.text + data.text
            }
            return updatedMessages
          }
          
          // Otherwise add as new message
          if (!data.done) {
            return [...prev, {
              id: Date.now().toString(),
              text: data.text,
              isUser: false,
              timestamp: new Date()
            }]
          }
          
          return prev
        })
      }
      
      if (data.done) {
        setIsLoading(false)
      }
    }
    
    newSocket.onerror = () => {
      setIsConnecting(false)
      setIsError(true)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "Sorry, there was an error connecting to the chat server. Please try again later.",
        isUser: false,
        timestamp: new Date()
      }])
    }
    
    newSocket.onclose = () => {
      setSocket(null)
    }
    
    setSocket(newSocket)
  }
  
  const handleSendMessage = () => {
    if (!inputValue.trim() || !socket) return
    
    // Add user message to the chat
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
    setIsLoading(true)
    
    // Send message to WebSocket server
    socket.send(JSON.stringify({ text: inputValue.trim() }))
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
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(prev => !prev)}
        className={`rounded-full w-14 h-14 shadow-lg ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-psg-blue hover:bg-blue-700'}`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-80 sm:w-96 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-psg-blue p-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-psg-blue font-bold text-sm">PSG</span>
                </div>
                <div>
                  <h3 className="font-semibold">PSG Assistant</h3>
                  <p className="text-xs opacity-90">Ask me anything about PSG</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-700 text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isConnecting && (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center">
                    <Loader2 className="animate-spin h-8 w-8 mx-auto mb-2 text-psg-blue" />
                    <p className="text-gray-500 dark:text-gray-400">Connecting...</p>
                  </div>
                </div>
              )}
              
              {isError && messages.length === 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-red-600 dark:text-red-400 text-center">
                  <p>Connection error. Please try again later.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={connectWebSocket}
                    className="mt-2 text-xs"
                  >
                    Retry Connection
                  </Button>
                </div>
              )}
              
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser 
                        ? 'bg-psg-blue text-white rounded-br-none' 
                        : 'bg-gray-100 dark:bg-gray-700 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm break-words">{message.text}</p>
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
                  placeholder="Type a message..."
                  className="flex-1 border dark:border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-psg-blue dark:bg-gray-700 text-sm resize-none"
                  rows={1}
                  disabled={isLoading || isConnecting || isError}
                />
                <Button 
                  type="submit"
                  size="icon"
                  disabled={isLoading || isConnecting || !inputValue.trim() || isError}
                  className="bg-psg-blue hover:bg-blue-700"
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

export default ChatWidget 