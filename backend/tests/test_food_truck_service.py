import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from app.services.food_truck_service import FoodTruckService
from app.models.food_truck import FoodTruck
from app.database.mongodb import MongoDB

@pytest.fixture
def mock_collection():
    """Fixture to create a mock MongoDB collection."""
    collection = AsyncMock()
    return collection

@pytest.fixture
def mock_mongodb(mock_collection):
    """Fixture to create a mock MongoDB instance."""
    with patch('app.services.food_truck_service.mongodb') as mock_mongodb:
        # Create a mock database
        mock_db = MagicMock()
        mock_db.__getitem__.return_value = mock_collection
        
        # Mock the MongoDB instance
        mock_mongodb.db = mock_db
        mock_mongodb.get_collection.return_value = mock_collection
        yield mock_mongodb

@pytest.fixture
def food_truck_service(mock_mongodb, mock_collection):
    """Fixture to create a FoodTruckService instance with a mock collection."""
    service = FoodTruckService()
    return service

def setup_mock_cursor(mock_collection, mock_trucks):
    """Helper function to setup mock cursor chain."""
    # Create a cursor mock that has skip() and limit() methods
    cursor = MagicMock()
    cursor.skip = MagicMock(return_value=cursor)
    cursor.limit = MagicMock(return_value=cursor)
    cursor.to_list = AsyncMock(return_value=mock_trucks)
    
    # Make find() return our cursor
    mock_collection.find = MagicMock(return_value=cursor)
    return cursor

@pytest.mark.asyncio
async def test_get_food_trucks_with_query(food_truck_service, mock_collection):
    """Test getting food trucks with a search query."""
    # Mock data
    mock_trucks = [
        {
            "locationid": 1571753,
            "applicant": "Test Truck",
            "facility_type": "Truck",
            "address": "123 Test St",
            "food_items": ["Test Food"],
            "latitude": 37.7620,
            "longitude": -122.4273,
            "status": "APPROVED",
            "permit": "21MFF-00015"
        }
    ]
    
    # Mock MongoDB responses
    mock_collection.count_documents.return_value = 1
    mock_cursor = setup_mock_cursor(mock_collection, mock_trucks)
    
    # Test the service
    trucks, total = await food_truck_service.get_food_trucks(query="Test", status=None, page=1)
    
    # Verify results
    assert len(trucks) == 1
    assert total == 1
    assert isinstance(trucks[0], FoodTruck)
    assert trucks[0].applicant == "Test Truck"
    
    # Verify MongoDB was called correctly
    mock_collection.find.assert_called_once()
    mock_collection.count_documents.assert_called_once()
    mock_cursor.skip.assert_called_once_with(0)  # (page - 1) * page_size
    mock_cursor.limit.assert_called_once_with(10)  # page_size

@pytest.mark.asyncio
async def test_get_food_trucks_with_status(food_truck_service, mock_collection):
    """Test getting food trucks filtered by status."""
    # Mock data
    mock_trucks = [
        {
            "locationid": 1571753,
            "applicant": "Test Truck",
            "facility_type": "Truck",
            "address": "123 Test St",
            "food_items": ["Test Food"],
            "latitude": 37.7620,
            "longitude": -122.4273,
            "status": "APPROVED",
            "permit": "21MFF-00015"
        }
    ]
    
    # Mock MongoDB responses
    mock_collection.count_documents.return_value = 1
    setup_mock_cursor(mock_collection, mock_trucks)
    
    # Test the service
    trucks, total = await food_truck_service.get_food_trucks(query=None, status="APPROVED", page=1)
    
    # Verify results
    assert len(trucks) == 1
    assert total == 1
    assert isinstance(trucks[0], FoodTruck)
    assert trucks[0].status == "APPROVED"
    
    # Verify MongoDB was called correctly
    mock_collection.find.assert_called_once()
    mock_collection.count_documents.assert_called_once()

@pytest.mark.asyncio
async def test_get_food_trucks_by_status(food_truck_service, mock_collection):
    """Test getting food trucks by specific status."""
    # Mock data
    mock_trucks = [
        {
            "locationid": 1571753,
            "applicant": "Test Truck",
            "facility_type": "Truck",
            "address": "123 Test St",
            "food_items": ["Test Food"],
            "latitude": 37.7620,
            "longitude": -122.4273,
            "status": "APPROVED",
            "permit": "21MFF-00015"
        }
    ]
    
    # Mock MongoDB response
    setup_mock_cursor(mock_collection, mock_trucks)
    
    # Test the service
    trucks = await food_truck_service.get_food_trucks_by_status("APPROVED")
    
    # Verify results
    assert len(trucks) == 1
    assert isinstance(trucks[0], FoodTruck)
    assert trucks[0].status == "APPROVED"
    
    # Verify MongoDB was called correctly
    mock_collection.find.assert_called_once_with({"status": {"$regex": "^APPROVED$", "$options": "i"}})

@pytest.mark.asyncio
async def test_get_food_trucks_by_status_not_found(food_truck_service, mock_collection):
    """Test getting food trucks by status when none are found."""
    # Mock empty MongoDB response
    setup_mock_cursor(mock_collection, [])
    
    # Test the service and verify it raises the expected exception
    with pytest.raises(Exception) as exc_info:
        await food_truck_service.get_food_trucks_by_status("INVALID_STATUS")
    
    assert "No food trucks found with status: INVALID_STATUS" in str(exc_info.value)
    
    # Verify MongoDB was called correctly
    mock_collection.find.assert_called_once_with({"status": {"$regex": "^INVALID_STATUS$", "$options": "i"}})

@pytest.mark.asyncio
async def test_get_food_trucks_pagination(food_truck_service, mock_collection):
    """Test food trucks pagination."""
    # Mock data
    mock_trucks = [
        {
            "locationid": 1571753,
            "applicant": "Test Truck",
            "facility_type": "Truck",
            "address": "123 Test St",
            "food_items": ["Test Food"],
            "latitude": 37.7620,
            "longitude": -122.4273,
            "status": "APPROVED",
            "permit": "21MFF-00015"
        }
    ]
    
    # Mock MongoDB responses
    mock_collection.count_documents.return_value = 15  # Total of 15 items
    mock_cursor = setup_mock_cursor(mock_collection, mock_trucks)
    
    # Test the service with page 2
    trucks, total = await food_truck_service.get_food_trucks(query=None, status=None, page=2)
    
    # Verify results
    assert len(trucks) == 1
    assert total == 15
    
    # Verify MongoDB was called correctly with pagination
    mock_collection.find.assert_called_once()
    mock_cursor.skip.assert_called_once_with(10)  # (page - 1) * page_size
    mock_cursor.limit.assert_called_once_with(10)  # page_size 