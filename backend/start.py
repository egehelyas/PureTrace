#!/usr/bin/env python3
"""
Startup script for PureTrace backend API
"""
import os
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def setup_environment():
    """Set up default environment variables if not set."""
    if not os.getenv("DATABASE_URL"):
        os.environ["DATABASE_URL"] = "sqlite:///./puretrace.db"
        print("Using default SQLite database: ./puretrace.db")
    
    if not os.getenv("FRONTEND_BASE_URL"):
        os.environ["FRONTEND_BASE_URL"] = "http://localhost:5173"
        print("Using default frontend URL: http://localhost:5173")

def main():
    """Main startup function."""
    setup_environment()
    
    print("Starting PureTrace API server...")
    print(f"Database: {os.getenv('DATABASE_URL')}")
    print(f"Frontend: {os.getenv('FRONTEND_BASE_URL')}")
    
    # Run the FastAPI server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main() 