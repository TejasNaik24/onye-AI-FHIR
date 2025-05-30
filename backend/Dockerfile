# Use an official Python runtime as a parent image
# We use a slim-buster image for a smaller size, suitable for deployment.
FROM python:3.9-slim-buster

# Set the working directory in the container
WORKDIR /app

# Install system dependencies needed for compiling Python packages (like 'blis' used by spaCy)
# and for general Python development headers. Also clean up apt cache.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        gcc \
        python3-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements.txt and install Python dependencies
# Using --no-cache-dir helps keep the Docker image smaller
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
# This will copy your main.py and any other necessary files into the /app directory
COPY . .

# Install Gunicorn, a production-ready WSGI server
# This is usually done in a separate step or included in requirements.txt if preferred
RUN pip install gunicorn

# Expose the port the app runs on (5000 in your docker-compose.yml and what Gunicorn listens on)
EXPOSE 5000

# Command to run the application using Gunicorn
# 'main' refers to your 'main.py' file.
# 'app' refers to the Flask application instance *within* your main.py file (e.g., 'app = Flask(__name__)').
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "main:app"]