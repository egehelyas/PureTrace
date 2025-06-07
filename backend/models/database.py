from sqlalchemy import Column, String, Date, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db import Base
import uuid

class Batch(Base):
    __tablename__ = "batches"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    product_name = Column(String, nullable=False)
    origin = Column(String, nullable=False)
    harvest_date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    events = relationship("Event", back_populates="batch", cascade="all, delete-orphan")

class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    batch_id = Column(String, ForeignKey("batches.id", ondelete="CASCADE"), nullable=False)
    event_type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    timestamp = Column(Date, nullable=False)
    location = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    batch = relationship("Batch", back_populates="events") 