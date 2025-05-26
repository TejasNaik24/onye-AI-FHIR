# Use an official Python runtime as a parent image.
# We'll stick with a slim version to keep the image size down.
FROM python:3.9-slim-buster

# Set the working directory in the container.
# All subsequent commands will run relative to this directory.
WORKDIR /app

# Install spaCy language model. This needs to happen before copying your requirements,
# as it's a system-level dependency.
# It's better to combine RUN commands to reduce image layers.
RUN pip install --no-cache-dir spacy \
    && python -m spacy download en_core_web_sm

# Copy the requirements file into the container.
# We copy it separately so that if only requirements.txt changes,
# Docker can re-use the pip install layer (caching).
COPY requirements.txt .

# Install any needed Python packages specified in requirements.txt.
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code into the container.
# This assumes your main.py is in the root of your backend directory.
COPY . .

# Make port 5000 available to the world outside this container.
EXPOSE 5000

# Define environment variables for Flask (optional but good practice).
# ENV FLASK_APP=main.py
# ENV FLASK_ENV=production # Use 'development' for dev builds, 'production' for prod

# Run main.py when the container launches.
# CMD ["flask", "run", "--host=0.0.0.0"] # If using 'flask run' command
CMD ["python", "main.py"] # If using app.run() directly in main.py