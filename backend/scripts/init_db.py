import sys
from pathlib import Path

# Add the project root directory to the Python path
project_root = str(Path(__file__).parent.parent)
sys.path.insert(0, project_root)

import asyncio
import csv
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import get_settings

settings = get_settings()

async def init_database():
    """Initialize the database with food truck data."""
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.database_name]
    collection = db[settings.collection_name]
    
    try:
        # Drop existing collection
        await collection.drop()
        
        # Read and process CSV
        foodtrucks = []
        with open("Mobile_Food_Facility_Permit.csv", 'r') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                try:
                    # Convert empty strings to None
                    for key in row:
                        if row[key] == '':
                            row[key] = None
                    
                    # Convert types
                    if row['locationid']:
                        row['locationid'] = int(row['locationid'])
                    if row['Latitude']:
                        row['latitude'] = float(row['Latitude'])
                    if row['Longitude']:
                        row['longitude'] = float(row['Longitude'])
                    if row['ExpirationDate']:
                        row['expiration_date'] = datetime.strptime(row['ExpirationDate'], '%m/%d/%Y %I:%M:%S %p')
                    
                    foodtruck = {
                        'locationid': row['locationid'],
                        'applicant': row['Applicant'],
                        'facility_type': row['FacilityType'],
                        'location_description': row['LocationDescription'],
                        'address': row['Address'],
                        'food_items': row['FoodItems'],
                        'latitude': row.get('latitude'),
                        'longitude': row.get('longitude'),
                        'schedule': row['Schedule'],
                        'status': row['Status'],
                        'permit': row['permit'],
                        'days_hours': row['dayshours'],
                        'expiration_date': row.get('expiration_date')
                    }
                    foodtrucks.append(foodtruck)
                except Exception as e:
                    print(f"Error processing row: {row}. Error: {str(e)}")
                    continue
            
            if foodtrucks:
                await collection.insert_many(foodtrucks)
                print(f"Successfully inserted {len(foodtrucks)} food trucks into the database")
                
    except Exception as e:
        print(f"Error initializing database: {str(e)}")
        raise
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(init_database()) 