from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List
from uuid import uuid4

from ..models.batch import BatchCreate, Batch as PydanticBatch, BatchCreationResponse
from ..models.database import Batch as SQLAlchemyBatch
from ..db import get_db
from ..utils import validate_uuid

router = APIRouter()

# Configuration for the frontend URL (can be moved to a config file later)
FRONTEND_BASE_URL = "http://localhost:5173"

@router.post("/batch", response_model=BatchCreationResponse)
async def create_batch(batch_input: BatchCreate, request: Request, db: Session = Depends(get_db)):
    """Create a new batch and return its ID and trace URL."""
    try:
        db_batch = SQLAlchemyBatch(
            product_name=batch_input.product_name,
            origin=batch_input.origin,
            harvest_date=batch_input.harvest_date
        )
        db.add(db_batch)
        db.commit()
        db.refresh(db_batch)

        # Construct the trace_url
        # Using request.url_for is more robust but requires naming the GET route.
        # For simplicity here, we construct it directly.
        trace_url = f"{FRONTEND_BASE_URL}/trace/{db_batch.id}"

        return BatchCreationResponse(
            batch_id=db_batch.id,
            trace_url=trace_url,
            product_name=db_batch.product_name,
            origin=db_batch.origin,
            harvest_date=db_batch.harvest_date
        )
    except Exception as e:
        db.rollback()
        # Consider logging the exception e
        raise HTTPException(status_code=500, detail=f"Failed to create batch: {str(e)}")

@router.get("/batch/{batch_id}", response_model=PydanticBatch)
async def get_batch(batch_id: str, db: Session = Depends(get_db)):
    """Get a batch by ID."""
    # Validate the batch_id format first
    validated_uuid = validate_uuid(batch_id)
    if not validated_uuid:
        raise HTTPException(status_code=400, detail=f"Invalid batch ID format: '{batch_id}'")
    
    try:
        # Query using the validated UUID
        db_batch = db.query(SQLAlchemyBatch).filter(SQLAlchemyBatch.id == validated_uuid).first()
        if db_batch is None:
            raise HTTPException(status_code=404, detail=f"Batch with id '{validated_uuid}' not found")
        return db_batch
    except HTTPException as http_exc: # Re-raise HTTPExceptions
        raise http_exc
    except Exception as e:
        # Consider logging the exception e
        raise HTTPException(status_code=500, detail=f"Failed to retrieve batch: {str(e)}") 