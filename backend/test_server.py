#!/usr/bin/env python3
import uvicorn
import os
import traceback

# Set environment variables
os.environ['DATABASE_URL'] = 'sqlite:///./puretrace.db'

try:
    print("Importing main app...")
    from main import app
    print("App imported successfully")
    
    print("Starting server on 127.0.0.1:8000...")
    uvicorn.run(app, host='127.0.0.1', port=8000, log_level='info')
    
except Exception as e:
    print(f'Error: {e}')
    traceback.print_exc() 