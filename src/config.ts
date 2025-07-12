// WebSocket configuration
// Default to localhost for development, can be overridden in a .env file
export const WS_BASE_URL = 'ws://localhost:8000'

export const WS_ENDPOINTS = {
  CHAT: `${WS_BASE_URL}/ws`,
  COURSE: `${WS_BASE_URL}/ws/course`,
  EVALUATION: `${WS_BASE_URL}/ws/evaluation`,
  CLEAR_MEMORY: `${WS_BASE_URL}/ws/clear-memory`,
}

// Chat widget configuration
export const CHAT_CONFIG = {
  RECONNECT_ATTEMPTS: 3,
  RECONNECT_INTERVAL: 5000, // in milliseconds
  WELCOME_MESSAGE: "Hi! I'm your PSG assistant. How can I help you today?",
  PLACEHOLDER: "Type a message...",
}

// PSG team colors
export const PSG_COLORS = {
  BLUE: '#004170', // Primary PSG blue
  RED: '#DA291C',  // PSG red
  WHITE: '#FFFFFF', // PSG white
}

export default {
  WS_BASE_URL,
  WS_ENDPOINTS,
  CHAT_CONFIG,
  PSG_COLORS,
} 