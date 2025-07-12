import { useState, useEffect, useCallback, useRef } from 'react'

export interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface ChatWebSocketOptions {
  url: string
  reconnectAttempts?: number
  reconnectInterval?: number
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Event) => void
}

export const useChatWebSocket = ({
  url,
  reconnectAttempts = 3,
  reconnectInterval = 5000,
  onConnect,
  onDisconnect,
  onError
}: ChatWebSocketOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimeoutRef = useRef<number | null>(null)
  
  // Connect to WebSocket
  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return
    
    try {
      setIsConnecting(true)
      setIsError(false)
      
      const socket = new WebSocket(url)
      
      socket.onopen = () => {
        setIsConnecting(false)
        setIsConnected(true)
        reconnectAttemptsRef.current = 0
        onConnect?.()
      }
      
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        
        if (data.text) {
          setMessages(prev => {
            // If the last message is from the bot and not finished, append to it
            const lastMessage = prev[prev.length - 1]
            if (lastMessage && !lastMessage.isUser && !data.done) {
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
        
        if (data.session_id && !sessionId) {
          setSessionId(data.session_id)
        }
        
        if (data.done) {
          setIsLoading(false)
        }
      }
      
      socket.onerror = (error) => {
        setIsConnecting(false)
        setIsConnected(false)
        setIsError(true)
        onError?.(error)
      }
      
      socket.onclose = () => {
        setIsConnected(false)
        onDisconnect?.()
        
        // Try to reconnect if we haven't exceeded the max attempts
        if (reconnectAttemptsRef.current < reconnectAttempts) {
          reconnectAttemptsRef.current += 1
          if (reconnectTimeoutRef.current) window.clearTimeout(reconnectTimeoutRef.current)
          reconnectTimeoutRef.current = window.setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }
      
      socketRef.current = socket
      
    } catch (err) {
      setIsConnecting(false)
      setIsConnected(false)
      setIsError(true)
      console.error('Error connecting to WebSocket:', err)
    }
  }, [url, reconnectAttempts, reconnectInterval, onConnect, onDisconnect, onError, sessionId])
  
  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close()
      socketRef.current = null
    }
    
    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    
    setIsConnected(false)
  }, [])
  
  // Send message through WebSocket
  const sendMessage = useCallback((text: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN || !text.trim()) {
      return false
    }
    
    // Add user message to local state
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
    setIsLoading(true)
    
    // Send message to WebSocket server
    socketRef.current.send(JSON.stringify({ text: text.trim() }))
    return true
  }, [])
  
  // Clear chat history
  const clearChat = useCallback(() => {
    setMessages([])
    
    // If we have a session ID, tell the server to clear memory
    if (sessionId && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const clearSocket = new WebSocket('ws://localhost:8000/ws/clear-memory')
      clearSocket.onopen = () => {
        clearSocket.send(JSON.stringify({ session_id: sessionId }))
      }
      
      clearSocket.onmessage = () => {
        clearSocket.close()
      }
    }
  }, [sessionId])
  
  // Clean up WebSocket connection on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])
  
  return {
    connect,
    disconnect,
    sendMessage,
    clearChat,
    messages,
    isConnecting,
    isConnected,
    isLoading,
    isError,
    sessionId
  }
} 