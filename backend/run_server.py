#!/usr/bin/env python3
"""
Simple script to run the FastAPI server
"""
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    import uvicorn
    from app.main import app
    
    if __name__ == "__main__":
        print("Starting UzimaSmart Backend Server...")
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8000,
            reload=True
        )
except ImportError as e:
    print(f"Import error: {e}")
    # Try simplified version without the problematic imports
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    
    app = FastAPI(
        title="Kenya Climate Change API",
        description="Progressive Web Application for Climate Change Monitoring in Kenya",
        version="1.0.0"
    )
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
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
            "environment": "development"
        }
    
    if __name__ == "__main__":
        print("Starting simplified UzimaSmart Backend Server...")
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8000,
            reload=False
        )
