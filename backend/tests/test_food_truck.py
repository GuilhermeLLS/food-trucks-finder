import pytest
from datetime import datetime
from app.models.food_truck import FoodTruck, FoodTruckListResponse

def test_food_truck_required_fields():
    """Test that required fields are properly validated"""
    # Test with minimal required fields
    food_truck = FoodTruck(
        locationid=1571753,
        applicant="Test Truck",
        facility_type="Truck",
        address="123 Test St",
        food_items=["Test Food"],
        latitude=37.7620,
        longitude=-122.4273,
        status="APPROVED",
        permit="21MFF-00015"
    ) # type: ignore -> We want an incomplete object here
    assert food_truck.locationid == 1571753
    assert food_truck.applicant == "Test Truck"
    assert food_truck.latitude == 37.7620
    assert food_truck.longitude == -122.4273

def test_food_truck_optional_fields():
    """Test that optional fields can be omitted"""
    food_truck = FoodTruck(
        locationid=1571753,
        applicant="Test Truck",
        facility_type="Truck",
        address="123 Test St",
        food_items=["Test Food"],
        latitude=37.7620,
        longitude=-122.4273,
        status="APPROVED",
        permit="21MFF-00015"
    ) # type: ignore -> We want an incomplete object here
    assert food_truck.location_description is None
    assert food_truck.schedule is None
    assert food_truck.days_hours is None
    assert food_truck.expiration_date is None

def test_food_truck_with_all_fields():
    """Test creating a food truck with all fields"""
    food_truck = FoodTruck(
        locationid=1571753,
        applicant="The Geez Freeze",
        facility_type="Truck",
        location_description="18TH ST: DOLORES ST to CHURCH ST",
        address="3750 18TH ST",
        food_items=["Snow Cones", "Soft Serve Ice Cream"],
        latitude=37.76201920035647,
        longitude=-122.42730642251331,
        schedule="http://example.com/schedule",
        status="APPROVED",
        permit="21MFF-00015",
        days_hours="Mo-Fr: 9AM-5PM",
        expiration_date=datetime(2024, 12, 31)
    )
    
    assert food_truck.locationid == 1571753
    assert food_truck.applicant == "The Geez Freeze"
    assert food_truck.location_description == "18TH ST: DOLORES ST to CHURCH ST"
    assert food_truck.food_items == ["Snow Cones", "Soft Serve Ice Cream"]
    assert food_truck.days_hours == "Mo-Fr: 9AM-5PM"
    assert food_truck.expiration_date == datetime(2024, 12, 31)

def test_food_truck_validation():
    """Test validation of field types and constraints"""
    with pytest.raises(ValueError):
        FoodTruck(
            locationid="not_an_int",  # type: ignore -> We want it to be a string
            applicant="Test Truck",
            facility_type="Truck",
            address="123 Test St",
            food_items=["Test Food"],
            latitude=37.7620,
            longitude=-122.4273,
            status="APPROVED",
            permit="21MFF-00015",
            location_description=None,
            schedule=None,
            days_hours=None,
            expiration_date=None
        )

def test_food_truck_list_response():
    """Test the FoodTruckListResponse model"""
    food_truck = FoodTruck(
        locationid=1571753,
        applicant="Test Truck",
        facility_type="Truck",
        address="123 Test St",
        food_items=["Test Food"],
        latitude=37.7620,
        longitude=-122.4273,
        status="APPROVED",
        permit="21MFF-00015",
        location_description=None,
        schedule=None,
        days_hours=None,
        expiration_date=None
    )
    
    response = FoodTruckListResponse(
        food_trucks=[food_truck],
        total=1
    )
    
    assert len(response.food_trucks) == 1
    assert response.total == 1
    assert response.food_trucks[0].locationid == 1571753 