from typing import AsyncGenerator, Optional
import json
import asyncio
import socket
import os
from groq import AsyncGroq, Groq
import logging
from app.memory import MemoryManager


class Model:

    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        # Initialize clients without any optional parameters
        if self.groq_api_key:
            try:
                self.groq_client = Groq(api_key=self.groq_api_key)
                self.groq_async_client = AsyncGroq(api_key=self.groq_api_key)
            except TypeError as e:
                logging.error(f"Error initializing Groq clients: {e}")
                # Fallback to basic initialization if the API changed
                from httpx import AsyncClient, Client
                self.groq_client = Groq(api_key=self.groq_api_key, http_client=Client())
                self.groq_async_client = AsyncGroq(api_key=self.groq_api_key, http_client=AsyncClient())
        else:
            logging.error("GROQ_API_KEY environment variable is not set")
            self.groq_client = None
            self.groq_async_client = None
            
        self.memory_manager = MemoryManager()

    def is_online(self) -> bool:
        """
        Vérifie la connexion à Internet en tentant d'atteindre un DNS public (Cloudflare).
        """
        host: str = "1.1.1.1"
        port: int = 53
        timeout: float = 1.5
        try:
            socket.setdefaulttimeout(timeout)
            socket.socket(socket.AF_INET, socket.SOCK_STREAM).connect((host, port))
            return True
        except socket.error:
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
        if session_id:
            self.memory_manager.add_user_message(session_id, user_query)
            
            # Get chat history and add to prompt if session_id is provided
            chat_history = ""
            if session_id in self.memory_manager.memories:
                chat_history = self.memory_manager.get_chat_history(session_id)
                
            # Format the prompt with chat history if it has the {chat_history} placeholder
            if "{chat_history}" in prompt:
                prompt = prompt.format(chat_history=f"Historique de la conversation :\n{chat_history}" if chat_history else "", rag_document="")
            
        if self.is_online() and self.groq_async_client:
            collected_chunks = []
            async for chunk in self.stream_groq_response_with_memory(prompt, user_query, model, session_id):
                collected_chunks.append(chunk)
                yield chunk
                
            if session_id:
                # Join all chunks to form the complete AI response
                complete_response = "".join([chunk for chunk in collected_chunks if chunk])
                if complete_response:
                    self.memory_manager.add_ai_message(session_id, complete_response)
        else:
            yield "Je ne suis pas en mesure de répondre en mode hors ligne pour le moment."

    async def stream_groq_response_with_memory(self, prompt: str, user_query: str, model: str = "llama3-70b-8192", session_id: Optional[str] = None) -> AsyncGenerator[str, None]:
        if not self.groq_async_client:
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
            prediction_stream = await self.groq_async_client.chat.completions.create(
                messages=messages,
                model=model,
                temperature=0.5,
                max_tokens=1024,  # Changed from max_completion_tokens to max_tokens
                top_p=1,
                stop=None,
                stream=True
            )
            
            async for chunk in prediction_stream:
                await asyncio.sleep(0.03)
                content = chunk.choices[0].delta.content
                if content:
                    yield content
        except Exception as e:
            logging.error(f"Error in Groq API call: {e}")
            yield f"Error: {str(e)}"