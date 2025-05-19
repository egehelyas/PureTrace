from pydantic import BaseModel, Field
from datetime import date
from typing import Optional, List
from uuid import UUID

class BatchBase(BaseModel):
    product_name: str = Field(..., description="Name of the product")
    origin: str = Field(..., description="Origin location of the product")
    harvest_date: date = Field(..., description="Date of harvest")

class BatchCreate(BatchBase):
    pass

class BatchEvent(BaseModel):
    event_type: str = Field(..., description="Type of event")
    description: str = Field(..., description="Description of the event")
    timestamp: date = Field(..., description="Timestamp of the event")
    location: str = Field(..., description="Location where the event occurred")
    batch_id: UUID = Field(..., description="ID of the batch this event belongs to")

class Batch(BatchBase):
    id: UUID = Field(..., description="Unique identifier for the batch")
    events: List[BatchEvent] = Field(default_factory=list, description="List of events associated with this batch")

    class Config:
        from_attributes = True

class BatchCreationResponse(BaseModel):
    batch_id: UUID = Field(..., description="Unique identifier for the created batch")
    trace_url: str = Field(..., description="URL to trace the batch on the frontend")
    product_name: str
    origin: str
    harvest_date: date 