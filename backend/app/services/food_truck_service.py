from typing import List, Optional, Tuple
from fastapi import HTTPException
from app.database.mongodb import mongodb
from app.models.food_truck import FoodTruck
from app.config.settings import get_settings

settings = get_settings()

class FoodTruckService:
    def __init__(self):
        self.collection = mongodb.get_collection(settings.collection_name)

    async def get_food_trucks(self, query: Optional[str], status: Optional[str], page: int) -> Tuple[List[FoodTruck], int]:
        """Get food trucks with optional search query and status filter."""
        page_size = 10
        filters = {}
        skip = (page - 1) * page_size 
        if query:
            filters["$or"] = [
                {"applicant": {"$regex": query, "$options": "i"}},
                {"address": {"$regex": query, "$options": "i"}}
            ]
        if status and status != "all":
            filters["status"] = {"$regex": f"^{status}$", "$options": "i"}
        total = await self.collection.count_documents(filters)
        trucks_cursor = self.collection.find(filters).skip(skip).limit(page_size)
        trucks_list = await trucks_cursor.to_list()
        food_trucks = [FoodTruck(**truck) for truck in trucks_list]
        return food_trucks, total
    
    async def get_food_trucks_by_status(self, status: str) -> List[FoodTruck]:
        """Get food trucks by status."""
        cursor = self.collection.find({"status": {"$regex": f"^{status}$", "$options": "i"}})
        foodtrucks = await cursor.to_list(length=100)
        if not foodtrucks:
            raise HTTPException(status_code=404, detail=f"No food trucks found with status: {status}")
        return [FoodTruck(**truck) for truck in foodtrucks] 