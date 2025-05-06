import pytest
from unittest.mock import AsyncMock
from fastapi.testclient import TestClient
from app.main import app
from app.services.food_truck_service import FoodTruckService
from app.models.food_truck import FoodTruck
from datetime import datetime
from app.routes.food_trucks import get_food_truck_service
from fastapi import HTTPException


@pytest.fixture
def mock_food_truck_service():
    """Fixture to create a mock FoodTruckService."""
    service = AsyncMock(spec=FoodTruckService)
    app.dependency_overrides[get_food_truck_service] = lambda: service
    yield service
    app.dependency_overrides = {}  # Clean up after test

@pytest.fixture
def client():
    """Fixture to create a test client."""
    return TestClient(app)

def test_read_foodtrucks_with_query(client, mock_food_truck_service):
    """Test getting food trucks with a search query."""
    # Mock data
    mock_trucks = [
        FoodTruck(
            locationid=1571753,
            applicant="Test Truck",
            facility_type="Truck",
            location_description="Test Location",
            address="123 Test St",
            food_items=["Test Food"],
            latitude=37.7620,
            longitude=-122.4273,
            schedule="http://example.com/schedule",
            status="APPROVED",
            permit="21MFF-00015",
            days_hours="Mo-Fr: 9AM-5PM",
            expiration_date=datetime(2024, 12, 31)
        )
    ]
    
    # Mock service response
    mock_food_truck_service.get_food_trucks.return_value = (mock_trucks, 1)
    
    # Make request
    response = client.get("/foodtrucks/?query=Test")
    
    # Verify response
    assert response.status_code == 200
    data = response.json()
    assert len(data["food_trucks"]) == 1
    assert data["total"] == 1
    assert data["food_trucks"][0]["applicant"] == "Test Truck"
    
    # Verify service was called correctly
    mock_food_truck_service.get_food_trucks.assert_called_once_with(
        query="Test",
        status=None,
        page=1
    )

def test_read_foodtrucks_with_status(client, mock_food_truck_service):
    """Test getting food trucks filtered by status."""
    # Mock data
    mock_trucks = [
        FoodTruck(
            locationid=1571753,
            applicant="Test Truck",
            facility_type="Truck",
            location_description="Test Location",
            address="123 Test St",
            food_items=["Test Food"],
            latitude=37.7620,
            longitude=-122.4273,
            schedule="http://example.com/schedule",
            status="APPROVED",
            permit="21MFF-00015",
            days_hours="Mo-Fr: 9AM-5PM",
            expiration_date=datetime(2024, 12, 31)
        )
    ]
    
    # Mock service response
    mock_food_truck_service.get_food_trucks.return_value = (mock_trucks, 1)
    
    # Make request
    response = client.get("/foodtrucks/?status=APPROVED")
    
    # Verify response
    assert response.status_code == 200
    data = response.json()
    assert len(data["food_trucks"]) == 1
    assert data["total"] == 1
    assert data["food_trucks"][0]["status"] == "APPROVED"
    
    # Verify service was called correctly
    mock_food_truck_service.get_food_trucks.assert_called_once_with(
        query=None,
        status="APPROVED",
        page=1
    )

def test_read_foodtrucks_pagination(client, mock_food_truck_service):
    """Test food trucks pagination."""
    # Mock data
    mock_trucks = [
        FoodTruck(
            locationid=1571753,
            applicant="Test Truck",
            facility_type="Truck",
            location_description="Test Location",
            address="123 Test St",
            food_items=["Test Food"],
            latitude=37.7620,
            longitude=-122.4273,
            schedule="http://example.com/schedule",
            status="APPROVED",
            permit="21MFF-00015",
            days_hours="Mo-Fr: 9AM-5PM",
            expiration_date=datetime(2024, 12, 31)
        )
    ]
    
    # Mock service response
    mock_food_truck_service.get_food_trucks.return_value = (mock_trucks, 15)
    
    # Make request
    response = client.get("/foodtrucks/?page=2")
    
    # Verify response
    assert response.status_code == 200
    data = response.json()
    assert len(data["food_trucks"]) == 1
    assert data["total"] == 15
    
    # Verify service was called correctly
    mock_food_truck_service.get_food_trucks.assert_called_once_with(
        query=None,
        status=None,
        page=2
    )

def test_read_foodtrucks_by_status(client, mock_food_truck_service):
    """Test getting food trucks by specific status."""
    # Mock data
    mock_trucks = [
        FoodTruck(
            locationid=1571753,
            applicant="Test Truck",
            facility_type="Truck",
            location_description="Test Location",
            address="123 Test St",
            food_items=["Test Food"],
            latitude=37.7620,
            longitude=-122.4273,
            schedule="http://example.com/schedule",
            status="APPROVED",
            permit="21MFF-00015",
            days_hours="Mo-Fr: 9AM-5PM",
            expiration_date=datetime(2024, 12, 31)
        )
    ]
    
    # Mock service response
    mock_food_truck_service.get_food_trucks_by_status.return_value = mock_trucks
    
    # Make request
    response = client.get("/foodtrucks/status/APPROVED")
    
    # Verify response
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["status"] == "APPROVED"
    
    # Verify service was called correctly with status parameter
    mock_food_truck_service.get_food_trucks_by_status.assert_called_once_with(status="APPROVED")

def test_read_foodtrucks_by_status_not_found(client, mock_food_truck_service):
    """Test getting food trucks by status when none are found."""
    # Mock service to raise HTTPException
    mock_food_truck_service.get_food_trucks_by_status.side_effect = HTTPException(
        status_code=404,
        detail="No food trucks found with status: INVALID_STATUS"
    )
    
    # Make request
    response = client.get("/foodtrucks/status/INVALID_STATUS")
    
    # Verify response
    assert response.status_code == 404
    data = response.json()
    assert "No food trucks found with status: INVALID_STATUS" in data["detail"]
    
    # Verify service was called correctly with status parameter
    mock_food_truck_service.get_food_trucks_by_status.assert_called_once_with(status="INVALID_STATUS") 