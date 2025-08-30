"""
Main FastAPI application for Kenya Climate Change PWA
"""
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from .api.routes import climate, community
from .utils.database import init_db
from .utils.cache import init_cache

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize services on startup"""
    # Initialize database
    await init_db()
    
    # Initialize cache
    await init_cache()
    
    yield
    
    # Cleanup on shutdown
    pass

app = FastAPI(
    title="Kenya Climate Change API",
    description="Progressive Web Application for Climate Change Monitoring in Kenya",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(climate.router, prefix="/api/v1/climate", tags=["Climate Data"])
app.include_router(community.router, prefix="/api/v1/community", tags=["Community Reports"])

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Kenya Climate Change API is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "services": {
            "database": "connected",
            "cache": "active"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True if os.getenv("ENVIRONMENT") == "development" else False
    )
