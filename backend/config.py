import os
from dotenv import load_dotenv

load_dotenv()

QWEN_API_KEY = os.getenv("QWEN_API_KEY")
QWEN_MODEL = os.getenv("QWEN_MODEL")
QWEN_BASE_URL = os.getenv("QWEN_BASE_URL")

if not QWEN_API_KEY:
    raise ValueError("QWEN_API_KEY is missing. Please add it to the .env file.")

if not QWEN_MODEL:
    raise ValueError("QWEN_MODEL is missing. Please add it to the .env file.")

if not QWEN_BASE_URL:
    raise ValueError("QWEN_BASE_URL is missing. Please add it to the .env file.")