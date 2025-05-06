from typing import List, Optional
from fastapi import APIRouter, Depends
from app.models.food_truck import FoodTruck, FoodTruckListResponse
from app.services.food_truck_service import FoodTruckService

router = APIRouter(prefix="/foodtrucks", tags=["foodtrucks"])

def get_food_truck_service() -> FoodTruckService:
    return FoodTruckService()

@router.get("/", response_model=FoodTruckListResponse)
async def read_foodtrucks(
    query: Optional[str] = None,
    status: Optional[str] = None,
    page: Optional[int] = 1,
    service: FoodTruckService = Depends(get_food_truck_service)
):
    food_trucks, total = await service.get_food_trucks(query=query, status=status, page=page or 1)
    return {"food_trucks": food_trucks, "total": total}

@router.get("/status/{status}", response_model=List[FoodTruck])
async def read_foodtrucks_by_status(
    status: str,
    service: FoodTruckService = Depends(get_food_truck_service)
):
    return await service.get_food_trucks_by_status(status=status) 