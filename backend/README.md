# Food Facilities API

A FastAPI-based REST API for managing and querying food facilities data, specifically focused on food trucks and mobile food facilities in San Francisco.

## Project Overview

This project provides a RESTful API to access and search through food facility data, with features like:

- Search food facilities by name or address
- Filter by status (APPROVED, REQUESTED, etc.)
- Pagination support
- Status-specific queries

## Why MongoDB?

MongoDB was chosen for this project for several reasons:

1. The data structure is relatively simple but contains some unstructured JSON-like data (e.g., food items as arrays)
2. The schema is flexible, allowing for easy modifications if the data structure changes
3. MongoDB's text search capabilities are well-suited for the search requirements
4. The data is primarily read-heavy with minimal write operations
5. The data can be easily imported from CSV/JSON sources

## Project Structure

```
.
├── app/
│   ├── config/         # Configuration settings
│   ├── database/       # Database connection and setup
│   ├── models/         # Pydantic models for data validation
│   ├── routes/         # API endpoints
│   ├── services/       # Business logic
│   └── main.py         # Application entry point
├── tests/              # Test suite
├── scripts/            # Utility scripts
│   └── init_db.py      # Database initialization script
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker services configuration
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## Prerequisites

- Python 3.8+
- Docker and Docker Compose (for containerized setup)
- MongoDB (if running bare metal)

## Setup and Running

### Using Docker (Recommended)

1. Clone the repository:

```bash
git clone <repository-url>
cd food-facilities-challenge
```

2. Build and start the containers:

```bash
docker-compose up --build
```

3. Initialize the database (in a new terminal):

```bash
docker-compose exec web python scripts/init_db.py
```

The API will be available at `http://localhost:8000`

### Bare Metal Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd food-facilities-challenge
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Start MongoDB:

```bash
mongod --dbpath /path/to/data/directory
```

5. Initialize the database:

```bash
python scripts/init_db.py
```

6. Run the application:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the application is running, you can access:

- Interactive API documentation: `http://localhost:8000/docs`
- Alternative API documentation: `http://localhost:8000/redoc`

## Testing

The project uses pytest for testing. The test suite includes:

- Unit tests for services
- Integration tests for API endpoints
- Mock tests for database interactions

To run the tests:

```bash
# Using Docker
docker-compose exec web pytest

# Bare metal
pytest
```

### Test Structure

- `tests/test_food_trucks_routes.py`: Tests for API endpoints
- Uses `AsyncMock` for mocking async functions
- Tests both successful and error scenarios
- Verifies correct parameter passing and response formats

## Development Tools

- **FastAPI**: Modern, fast web framework for building APIs
- **Pydantic**: Data validation and settings management
- **MongoDB**: NoSQL database for flexible data storage
- **pytest**: Testing framework
- **Docker**: Containerization for consistent development and deployment
- **AsyncMock**: For testing async functions
