from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

class FoodTruck(BaseModel):
    locationid: int = Field(..., description="Unique identifier for the food truck location")
    applicant: str = Field(..., description="Name of the food truck applicant")
    facility_type: str = Field(..., description="Type of facility")
    location_description: Optional[str] = Field(None, description="Description of the location")
    address: Optional[str] = Field(..., description="Street address of the food truck")
    food_items: str = Field(..., description="List of food items sold")
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")
    schedule: Optional[str] = Field(None, description="URL to the schedule")
    status: Optional[str] = Field(..., description="Current status of the permit")
    permit: Optional[str] = Field(..., description="Permit number")
    days_hours: Optional[str] = Field(None, description="Operating days and hours")
    expiration_date: Optional[datetime] = Field(None, description="Permit expiration date")

    class Config:
        json_schema_extra = {
            "example": {
                "locationid": 1571753,
                "applicant": "The Geez Freeze",
                "facility_type": "Truck",
                "location_description": "18TH ST: DOLORES ST to CHURCH ST",
                "address": "3750 18TH ST",
                "food_items": "Snow Cones: Soft Serve Ice Cream",
                "latitude": 37.76201920035647,
                "longitude": -122.42730642251331,
                "schedule": "http://example.com/schedule",
                "status": "APPROVED",
                "permit": "21MFF-00015",
                "days_hours": "Mo-Fr: 9AM-5PM",
                "expiration_date": "2024-12-31T00:00:00"
            }
        }

class FoodTruckListResponse(BaseModel):
    food_trucks: List[FoodTruck] = Field(..., description="List of food trucks")
    total: int = Field(..., description="Total number of food trucks matching the query")

    class Config:
        json_schema_extra = {
            "example": {
                "food_trucks": [
                    {
                        "locationid": 1571753,
                        "applicant": "The Geez Freeze",
                        "facility_type": "Truck",
                        "location_description": "18TH ST: DOLORES ST to CHURCH ST",
                        "address": "3750 18TH ST",
                        "food_items": "Snow Cones: Soft Serve Ice Cream",
                        "latitude": 37.76201920035647,
                        "longitude": -122.42730642251331,
                        "schedule": "http://example.com/schedule",
                        "status": "APPROVED",
                        "permit": "21MFF-00015",
                        "days_hours": "Mo-Fr: 9AM-5PM",
                        "expiration_date": "2024-12-31T00:00:00"
                    }
                ],
                "total": 1
            }
        } 