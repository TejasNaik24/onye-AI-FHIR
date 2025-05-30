# Use a Python base image
FROM python:3.9-slim-buster

# Set the working directory in the container
WORKDIR /app

# Install build dependencies for Python packages (like 'blis' for spaCy)
# This includes gcc, etc.
RUN apt-get update && apt-get install -y build-essential

# Copy requirements.txt and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Gunicorn, a production-ready WSGI server
RUN pip install gunicorn

# Copy the rest of the application code
COPY . .

# Expose the port Flask runs on
EXPOSE 5000

# Command to run the Flask application using Gunicorn
# Assuming your Flask app instance is named 'app' in main.py.
# If your Flask app object is named 'main' in main.py, use 'main:main'.
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "main:app"]