import os
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

PROJECT_ROOT = os.path.dirname(os.path.dirname(__file__))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.routes.api import router


# Create FastAPI app
app = FastAPI(
    title="Multi-Agent Software Engineer",
    description="Agent Society powered by Qwen Cloud",
    version="1.0.0"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include API routes
app.include_router(router, prefix="/api")


# Root endpoint
@app.get("/")
def home():
    return {
        "message": "Multi-Agent Software Engineer is running 🚀"
    }
# 
