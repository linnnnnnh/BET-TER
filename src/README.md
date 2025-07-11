# AI Chatbot Backend

This directory contains the backend code for the AI chatbot that powers BET-TER. The chatbot uses FastAPI for WebSocket communication and the Groq API for LLM capabilities.
```bash
Python Version Recommendation
Python  <=3.12
```
## Manual Setup

If you prefer to set things up manually:

1. Create a virtual environment:
```bash
cd src
```
```bash
python -m venv venv
```
```bash
source venv/bin/activate #Linux
```
```bash
venv\Scripts\activate #Windows
```

2. Install dependencies:
```bash
pip install -r ../requirements.txt
```


3. Groq API key :
```bash
$env:GROQ_API_KEY =""  #Windows
```
```bash
export GROQ_API_KEY =""  #Linux
```


## Running the Server

Start the server with:

```bash
python main.py
```

This will start the FastAPI server at `http://0.0.0.0:8000`.

## Available WebSocket Endpoints

- `/ws` - Main chat endpoint that handles both text and audio messages
- `/ws/course` - Course-specific chat endpoint for educational content
- `/ws/evaluation` - Evaluation endpoint to test user knowledge
- `/ws/clear-memory` - Endpoint to clear conversation history for a session

## Troubleshooting

If you encounter an error about `proxies` when initializing the Groq client, make sure you have installed the correct version of the Groq library as specified in the requirements.txt file.

## Project Structure

- `main.py` - FastAPI server setup and WebSocket endpoint handlers
- `app/`
  - `weboscket.py` - Model integration with Groq API
  - `memory.py` - Conversation memory management
  - `prompt.py` - Prompt templates for different chat scenarios
  - `utils.py` - Utility functions for file handling and audio validation 