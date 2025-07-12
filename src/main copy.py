from groq import Groq

client = Groq()
completion = client.chat.completions.create(
    model="meta-llama/llama-4-scout-17b-16e-instruct",
    messages=[
      {
        "role": "user",
        "content": "Hello, how are you?"
      }
    ],
    temperature=1,
    max_tokens=1024,
    top_p=1,
    stream=True,
    stop=None,
)

for chunk in completion:
    print(chunk.choices[0].delta.content or "", end="")
# from dotenv import load_dotenv
# import os

# load_dotenv()

# print("GROQ_API_KEY =", os.getenv("GROQ_API_KEY"))