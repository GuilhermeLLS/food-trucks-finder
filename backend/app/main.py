from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.routes import food_trucks
from app.database.mongodb import mongodb
from app.config.settings import get_settings

settings = get_settings()

@asynccontextmanager
async def lifespan(_app: FastAPI):
    await mongodb.connect_to_database()
    yield
    await mongodb.close_database_connection()

app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(food_trucks.router)

@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Welcome to Food Facilities API"} 