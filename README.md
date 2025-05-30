# ONYE-AI-FHIR Query Tool

This project provides an AI-powered query tool for FHIR data, consisting of a Python backend (Flask) and a Next.js frontend.

Check out the project demo [here](https://drive.google.com/file/d/1EAP_PTWCEJXnIGppZeGNqjp02wA9lLOz/view?usp=sharing)!
---

## Running the Application

This guide explains how to set up and run the frontend and backend services directly on your local machine for development purposes.

### Prerequisites

Before you start, ensure you have the following installed on your system:

* **Python 3.9+**:
    * [Download Python](https://www.python.org/downloads/)
* **Node.js (LTS version recommended) and npm/yarn**:
    * [Download Node.js](https://nodejs.org/en/download/) (npm is installed with Node.js)
* **Git**:
    * [Download Git](https://git-scm.com/downloads) (usually pre-installed on macOS/Linux)
* **Docker**:
    * [Download Docker](https://www.docker.com) (needed for downloading libraries/dependencies)

### 1. Clone the Repository
You can follow this [video](https://drive.google.com/file/d/1WdDehCanRc4PiICoQSawgFukOykdHKO6/view?usp=sharing) here for the setup or read below:

First, open your terminal or command prompt and clone the project repository:

```bash
git clone https://github.com/TejasNaik24/onye-AI-FHIR
```

### 2. Create an env file

**IMPORTANT** The .env file is not pushed to GitHub, so you must create the file yourself using the example file.


1.  Navigate into the `frontend` directory:

2.  Create a new file in the frontend directory and name it .env.local.

3.  Then paste the line:

   ``` bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
```
In the file, just like the example .env file.

### 3. Run Dockerfile for installing libraries and dependencies

1. Now, just run the command:
``` bash
docker-compose up --build
```
This will then install everything needed and will automatically start the backend and frontend

**Then simply go to**:

```bash
http://localhost:3000
```

**This will have the full project here and running.**

Note: The Flask backend service in this project is consistently configured to run on port 5000. When running locally with Docker Compose, you can access the backend in your browser at **http://localhost:5000**, and the frontend communicates with it internally at **http://backend:5000** within the Docker network. Please make sure you don't have any other ports on this one running.

