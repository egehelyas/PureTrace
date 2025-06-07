# PureTrace Backend API

FastAPI backend for the PureTrace food traceability application.

## Features

- **Batch Management**: Create and retrieve product batches
- **Event Logging**: Log lifecycle events for each batch
- **QR Code Integration**: Generate trace URLs for frontend QR codes
- **Database Support**: SQLite (default) or PostgreSQL
- **CORS Enabled**: Ready for frontend integration

## Quick Start

1. **Install Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Set Environment Variables** (optional):
   ```bash
   # Create .env file (optional - defaults to SQLite)
   echo "DATABASE_URL=sqlite:///./puretrace.db" > .env
   ```

3. **Start the Server**:
   ```bash
   python start.py
   ```
   Or directly with uvicorn:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **API Documentation**:
   Visit: http://localhost:8000/docs

## API Endpoints

### Batches
- `POST /batch` - Create a new batch
- `GET /batch/{batch_id}` - Get batch with events

### Events  
- `POST /event` - Add event to a batch
- `GET /batch/{batch_id}/events` - Get all events for a batch

## Database Configuration

### SQLite (Default)
```bash
DATABASE_URL=sqlite:///./puretrace.db
```

### PostgreSQL
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/puretrace
```

### Supabase
```bash
DATABASE_URL=postgresql://username:password@db.supabaseproject.co:5432/postgres
```

## Environment Variables

- `DATABASE_URL` - Database connection string (default: SQLite)
- `FRONTEND_BASE_URL` - Frontend URL for trace links (default: http://localhost:5173)

## Development

The API includes:
- Automatic database table creation
- CORS middleware for frontend integration
- UUID-based batch and event IDs
- Input validation with Pydantic
- Error handling and logging 