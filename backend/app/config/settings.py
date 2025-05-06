from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "Food Facilities API"
    mongodb_url: str = ""
    database_name: str = ""
    collection_name: str = ""
    allowed_origins: str = ""
    
    class Config:
        env_file = ".env"
        env_prefix = ""

@lru_cache()
def get_settings() -> Settings:
    return Settings()