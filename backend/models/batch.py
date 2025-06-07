from pydantic import BaseModel, Field, validator
from datetime import date, datetime
from typing import Optional, List, Union
from uuid import UUID

class BatchBase(BaseModel):
    product_name: str = Field(..., description="Name of the product")
    origin: str = Field(..., description="Origin location of the product")
    harvest_date: date = Field(..., description="Date of harvest")

class BatchCreate(BatchBase):
    pass

class BatchEvent(BaseModel):
    id: Union[str, UUID] = Field(..., description="Unique identifier for the event")
    event_type: str = Field(..., description="Type of event")
    description: str = Field(..., description="Description of the event")
    timestamp: date = Field(..., description="Timestamp of the event")
    location: str = Field(..., description="Location where the event occurred")
    batch_id: Union[str, UUID] = Field(..., description="ID of the batch this event belongs to")
    created_at: datetime = Field(..., description="When the event was recorded")

    @validator('id', 'batch_id', pre=True)
    def convert_uuid_to_str(cls, v):
        if isinstance(v, UUID):
            return str(v)
        return v

    class Config:
        from_attributes = True

class BatchEventCreate(BaseModel):
    event_type: str = Field(..., description="Type of event")
    description: str = Field(..., description="Description of the event")
    timestamp: date = Field(..., description="Timestamp of the event")
    location: str = Field(..., description="Location where the event occurred")
    batch_id: Union[str, UUID] = Field(..., description="ID of the batch this event belongs to")

    @validator('batch_id', pre=True)
    def convert_uuid_to_str(cls, v):
        if isinstance(v, UUID):
            return str(v)
        return v

class Batch(BatchBase):
    id: Union[str, UUID] = Field(..., description="Unique identifier for the batch")
    created_at: datetime = Field(..., description="When the batch was created")
    events: List[BatchEvent] = Field(default_factory=list, description="List of events associated with this batch")

    @validator('id', pre=True)
    def convert_uuid_to_str(cls, v):
        if isinstance(v, UUID):
            return str(v)
        return v

    class Config:
        from_attributes = True

class BatchCreationResponse(BaseModel):
    batch_id: Union[str, UUID] = Field(..., description="Unique identifier for the created batch")
    trace_url: str = Field(..., description="URL to trace the batch on the frontend")
    product_name: str
    origin: str
    harvest_date: date

    @validator('batch_id', pre=True)
    def convert_uuid_to_str(cls, v):
        if isinstance(v, UUID):
            return str(v)
        return v 