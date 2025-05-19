from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import batch, event
from .db import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PureTrace API",
    description="API for product traceability system",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(batch.router, tags=["batches"])
app.include_router(event.router, tags=["events"])

@app.get("/")
async def root():
    return {"message": "Welcome to PureTrace API"} 