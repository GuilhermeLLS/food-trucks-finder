from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config.settings import get_settings

settings = get_settings()

class MongoDB:
    client: AsyncIOMotorClient
    db: AsyncIOMotorDatabase

    @classmethod
    async def connect_to_database(cls):
        cls.client = AsyncIOMotorClient(settings.mongodb_url)
        cls.db = cls.client[settings.database_name]

    @classmethod
    async def close_database_connection(cls):
        if cls.client:
            cls.client.close()

    @classmethod
    def get_collection(cls, collection_name: str):
        return cls.db[collection_name]

mongodb = MongoDB() 