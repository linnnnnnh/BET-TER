from typing import AsyncGenerator, Optional
import json
import asyncio
import socket
import os
import requests
from groq import AsyncGroq, Groq
import logging
from app.memory import MemoryManager

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class Model:

    def __init__(self):
        print("Initializing Model...")
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        print(f"API Key present: {bool(self.groq_api_key)}")
        # Initialize clients without any optional parameters
        if self.groq_api_key:
            try:
                logger.info("Initializing Groq clients with API key")
                self.groq_client = Groq(api_key=self.groq_api_key)
                self.groq_async_client = AsyncGroq(api_key=self.groq_api_key)
            except TypeError as e:
                logging.error(f"Error initializing Groq clients: {e}")
                # Fallback to basic initialization if the API changed
                from httpx import AsyncClient, Client
                logger.info("Using fallback initialization with httpx clients")
                self.groq_client = Groq(api_key=self.groq_api_key, http_client=Client())
                self.groq_async_client = AsyncGroq(api_key=self.groq_api_key, http_client=AsyncClient())
        else:
            logging.error("GROQ_API_KEY environment variable is not set")
            self.groq_client = None
            self.groq_async_client = None
            
        self.memory_manager = MemoryManager()

    def is_online(self) -> bool:
        """
        Check internet connectivity using multiple methods and endpoints
        """
        # Method 1: Try to connect to Cloudflare DNS
        def try_socket_connection():
            hosts = [
                ("1.1.1.1", 53),  # Cloudflare DNS
                ("8.8.8.8", 53),  # Google DNS
                ("api.groq.com", 443)  # Groq API endpoint
            ]
            
            for host, port in hosts:
                try:
                    logger.info(f"Checking socket connection to {host}:{port}")
                    socket.setdefaulttimeout(1.5)
                    socket.socket(socket.AF_INET, socket.SOCK_STREAM).connect((host, port))
                    logger.info(f"Socket connection to {host}:{port} succeeded")
                    return True
                except socket.error as e:
                    logger.warning(f"Socket connection to {host}:{port} failed: {str(e)}")
            
            return False
        
        # Method 2: Try HTTP requests
        def try_http_request():
            urls = [
                "https://www.google.com",
                "https://www.cloudflare.com",
                "https://api.groq.com/status"  # May not be a real endpoint, but worth a try
            ]
            
            for url in urls:
                try:
                    logger.info(f"Checking HTTP connection to {url}")
                    response = requests.get(url, timeout=2)
                    if response.status_code == 200:
                        logger.info(f"HTTP connection to {url} succeeded")
                        return True
                    else:
                        logger.warning(f"HTTP connection to {url} returned status code {response.status_code}")
                except requests.exceptions.RequestException as e:
                    logger.warning(f"HTTP connection to {url} failed: {str(e)}")
            
            return False
        
        # Try each method
        if try_socket_connection():
            return True
            
        if try_http_request():
            return True
            
        logger.error("All connectivity checks failed, we appear to be offline")
        return False

    def groq_speech_to_text(self, audio: bytes) -> str:
        if not self.groq_client:
            raise ValueError("Groq client is not initialized. Make sure GROQ_API_KEY is set.")
            
        response = self.groq_client.audio.transcriptions.create(
            file=("audio.wav", audio),  # (nom, bytes, type_mime)
            model="whisper-large-v3",
            response_format="json",
            language="en",
            temperature=0.0
        )
        return response.text
            
    def groq_text_to_speech(self, message: str) -> bytes:
        if not self.groq_client:
            raise ValueError("Groq client is not initialized. Make sure GROQ_API_KEY is set.")
            
        response = self.groq_client.audio.speech.create(
            model="playai-tts",
            voice="Fritz-PlayAI",
            input=message,
            response_format="wav"
        )
        return response.read()

    async def groq_voice_chat(self, audio: bytes, prompt: str, session_id: str) -> bytes:
        if not self.is_online():
            raise ValueError("You need to be online for speech chat")
        voice_to_text: str = self.groq_speech_to_text(audio=audio)
        
        # Add user message to memory
        self.memory_manager.add_user_message(session_id, voice_to_text)
        chat_response = ""
        async for chunk in self.stream_groq_response_with_memory(
            prompt=prompt, user_query=voice_to_text, session_id=session_id):
            chat_response += chunk
        
        audio_response: bytes = self.groq_text_to_speech(
            message=chat_response)

        return audio_response

    async def stream_text_response(self, prompt: str, user_query: str, model: str = "llama3-70b-8192", session_id: Optional[str] = None) -> AsyncGenerator[str, None]:
        logger.info(f"stream_text_response called with query: '{user_query}', model: {model}, session_id: {session_id}")
        
        if session_id:
            self.memory_manager.add_user_message(session_id, user_query)
            
            # Get chat history and add to prompt if session_id is provided
            chat_history = ""
            if session_id in self.memory_manager.memories:
                chat_history = self.memory_manager.get_chat_history(session_id)
                
            # Format the prompt with chat history if it has the {chat_history} placeholder
            if "{chat_history}" in prompt:
                prompt = prompt.format(chat_history=f"Historique de la conversation :\n{chat_history}" if chat_history else "", rag_document="")
            
        is_online = self.is_online()
        logger.info(f"Is online: {is_online}, Groq client initialized: {self.groq_async_client is not None}")
        
        if is_online and self.groq_async_client:
            logger.info("Attempting to stream response from Groq API")
            collected_chunks = []
            try:
                async for chunk in self.stream_groq_response_with_memory(prompt, user_query, model, session_id):
                    collected_chunks.append(chunk)
                    yield chunk
                    
                if session_id:
                    # Join all chunks to form the complete AI response
                    complete_response = "".join([chunk for chunk in collected_chunks if chunk])
                    if complete_response:
                        self.memory_manager.add_ai_message(session_id, complete_response)
            except Exception as e:
                logger.error(f"Error streaming response: {e}")
                yield f"Error occurred while processing your request: {str(e)}"
        else:
            reason = "Offline mode" if not is_online else "Groq client not initialized"
            logger.error(f"Cannot stream response: {reason}")
            # Try direct API call if Groq client is available but online check failed
            if not is_online and self.groq_async_client:
                logger.info("Online check failed but Groq client is available, trying direct API call")
                try:
                    async for chunk in self.stream_groq_response_with_memory(prompt, user_query, model, session_id):
                        yield chunk
                    return
                except Exception as e:
                    logger.error(f"Direct API call failed: {e}")
            
            yield "Je ne suis pas en mesure de répondre en mode hors ligne pour le moment."

    async def stream_groq_response_with_memory(self, prompt: str, user_query: str, model: str = "llama3-70b-8192", session_id: Optional[str] = None) -> AsyncGenerator[str, None]:
        if not self.groq_async_client:
            logger.error("Groq async client is not initialized")
            yield "Groq client is not initialized. Make sure GROQ_API_KEY is set."
            return
            
        # Prepare messages with memory if session_id is provided
        messages = [
            {
                "role": "system",
                "content": f"{prompt}"
            }
        ]
        # Add conversation history if session_id is provided
        if session_id:
            chat_history = self.memory_manager.get_chat_history(session_id)
            # Include chat history in the system prompt
            messages[0]["content"] += f"\n\nConversation history:\n{chat_history}"

        # Add current user query
        messages.append({
            "role": "user",
            "content": f"{user_query}"
        })

        try:
            logger.info(f"Making API call to Groq with model: {model}")
            prediction_stream = await self.groq_async_client.chat.completions.create(
                messages=messages,
                model=model,
                temperature=0.5,
                max_tokens=1024,  # Changed from max_completion_tokens to max_tokens
                top_p=1,
                stop=None,
                stream=True
            )
            
            logger.info("API call successful, streaming response")
            async for chunk in prediction_stream:
                await asyncio.sleep(0.03)
                content = chunk.choices[0].delta.content
                if content:
                    yield content
        except Exception as e:
            logging.error(f"Error in Groq API call: {e}")
            yield f"Error: {str(e)}"