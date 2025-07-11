from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime

class Message:
    """A simple message class for storing chat history."""
    
    def __init__(self, role: str, content: str):
        """
        Initialize a new message.
        
        Args:
            role: The role of the sender (user or ai).
            content: The content of the message.
        """
        self.role = role
        self.content = content
        self.timestamp = datetime.now()
    
    def __str__(self) -> str:
        return f"{self.role}: {self.content}"

class ChatHistory:
    """A simple chat history implementation."""
    
    def __init__(self):
        """Initialize a new chat history."""
        self.messages: List[Message] = []
    
    def add_user_message(self, content: str) -> None:
        """Add a user message to the history."""
        self.messages.append(Message("user", content))
    
    def add_ai_message(self, content: str) -> None:
        """Add an AI message to the history."""
        self.messages.append(Message("ai", content))
    
    def clear(self) -> None:
        """Clear the chat history."""
        self.messages = []
    
    def get_history_string(self) -> str:
        """Get the chat history as a string."""
        if not self.messages:
            return ""
        
        history_str = ""
        for msg in self.messages:
            history_str += f"{msg.role.capitalize()}: {msg.content}\n\n"
        
        return history_str.strip()

class MemoryManager:
    """Manages conversation memory for multiple users."""
    
    def __init__(self):
        # Dictionary to store conversation memory by session_id
        self.memories: Dict[str, ChatHistory] = {}
    
    def get_memory(self, session_id: Optional[str] = None) -> ChatHistory:
        """
        Get or create memory for a specific session.
        
        Args:
            session_id: The unique identifier for the session. If None, a new session is created.
            
        Returns:
            The conversation memory for the session.
        """
        if session_id is None:
            session_id = str(uuid.uuid4())
        
        if session_id not in self.memories:
            self.memories[session_id] = ChatHistory()
        
        return self.memories[session_id]
    
    def add_user_message(self, session_id: str, message: str) -> None:
        """
        Add a user message to the memory.
        
        Args:
            session_id: The session identifier.
            message: The user's message.
        """
        memory = self.get_memory(session_id)
        memory.add_user_message(message)
    
    def add_ai_message(self, session_id: str, message: str) -> None:
        """
        Add an AI message to the memory.
        
        Args:
            session_id: The session identifier.
            message: The AI's message.
        """
        memory = self.get_memory(session_id)
        memory.add_ai_message(message)
    
    def get_chat_history(self, session_id: str) -> str:
        """
        Get the conversation history as a formatted string.
        
        Args:
            session_id: The session identifier.
            
        Returns:
            The conversation history as a string.
        """
        memory = self.get_memory(session_id)
        return memory.get_history_string()
    
    def clear_memory(self, session_id: str) -> None:
        """
        Clear the memory for a specific session.
        
        Args:
            session_id: The session identifier.
        """
        if session_id in self.memories:
            self.memories[session_id].clear() 