FROM python:3.13.3

WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Set environment variables
ENV MONGODB_URL=mongodb://mongodb:27017
ENV DATABASE_NAME=foodtruck_db
ENV COLLECTION_NAME=foodtrucks

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"] 