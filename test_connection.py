import os
import socket
import logging
import requests
from dotenv import load_dotenv
from groq import Groq

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def is_online() -> bool:
    """
    Check internet connectivity using multiple methods and endpoints
    """
    # Method 1: Try to connect to DNS servers
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

def test_groq_api():
    """
    Test the Groq API connection
    """
    # Load environment variables from .env file if it exists
    load_dotenv()
    
    # Get the API key
    groq_api_key = os.getenv("GROQ_API_KEY")
    logger.info(f"API Key present: {bool(groq_api_key)}")
    
    if not groq_api_key:
        logger.error("GROQ_API_KEY environment variable is not set")
        return
    
    # Check online status
    online_status = is_online()
    logger.info(f"Online status: {online_status}")
    if not online_status:
        logger.error("No internet connection detected, but will try API call anyway")
    
    # Try to initialize the Groq client
    try:
        logger.info("Initializing Groq client")
        groq_client = Groq(api_key=groq_api_key)
        
        # Test a simple API call
        logger.info("Testing API call to Groq")
        response = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say hello"}
            ],
            model="llama3-8b-8192",
            temperature=0,
            max_tokens=10
        )
        
        logger.info(f"API call successful! Response: {response.choices[0].message.content}")
        return True
    except Exception as e:
        logger.error(f"Error with Groq API: {e}")
        return False

if __name__ == "__main__":
    print("Testing Groq API connection...")
    success = test_groq_api()
    if success:
        print("✅ Connection to Groq API successful!")
    else:
        print("❌ Connection to Groq API failed. Check the logs for details.") 