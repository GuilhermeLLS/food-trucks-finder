from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "Food Facilities API"
    mongodb_url: str = ""  # Default empty string
    database_name: str = ""  # Default empty string
    collection_name: str = ""  # Default empty string
    allowed_origins: str = ""
    
    class Config:
        env_file = ".env"
        env_prefix = ""  # No prefix for environment variables

@lru_cache()
def get_settings() -> Settings:
    return Settings()