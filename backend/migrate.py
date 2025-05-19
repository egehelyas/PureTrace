from db import Base, engine
from models.database import Batch, Event  # This imports the models to ensure they are registered with Base

def run_migrations():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    run_migrations() 