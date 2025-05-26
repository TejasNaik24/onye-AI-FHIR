# ONYE-AI-FHIR Query Tool

This project provides an AI-powered query tool for FHIR data, consisting of a Python backend (Flask) and a Next.js frontend.

check out the project [here](https://drive.google.com/file/d/1EAP_PTWCEJXnIGppZeGNqjp02wA9lLOz/view?usp=sharing)!
---

## Running the Application Without Docker (Local Development)

This guide explains how to set up and run the frontend and backend services directly on your local machine for development purposes.

### Prerequisites

Before you start, ensure you have the following installed on your system:

* **Python 3.9+**:
    * [Download Python](https://www.python.org/downloads/)
* **Node.js (LTS version recommended) and npm/yarn**:
    * [Download Node.js](https://nodejs.org/en/download/) (npm is installed with Node.js)
    * [Install Yarn (optional, but used in some commands)](https://yarnpkg.com/getting-started/install)
* **Git**:
    * [Download Git](https://git-scm.com/downloads) (usually pre-installed on macOS/Linux)

### 1. Clone the Repository
You can follow this [video](https://drive.google.com/file/d/1WdDehCanRc4PiICoQSawgFukOykdHKO6/view?usp=sharing) here for the setup or read below:

First, open your terminal or command prompt and clone the project repository:

```bash
git clone https://github.com/TejasNaik24/onye-AI-FHIR # Replace with the actual URL of your Git repository
cd ONYE-AI-FHIR # Navigate into the project's root directory
```

### 2. Set Up and Run the Backend

The backend is a Flask application that handles the AI query logic and interacts with FHIR data.

#### Install Python Dependencies

1.  Navigate into the `backend` directory:
    ```bash
    cd backend
    ```
2.  **Create a Python virtual environment (Highly Recommended)**:
    This isolates your project's dependencies from other Python projects.
    ```bash
    python3 -m venv venv
    ```
3.  **Activate the virtual environment**:
    * **On macOS/Linux**:
        ```bash
        source venv/bin/activate
        ```
    * **On Windows (Command Prompt)**:
        ```bash
        venv\Scripts\activate.bat
        ```
    * **On Windows (PowerShell)**:
        ```bash
        .\venv\Scripts\Activate.ps1
        ```
    (You'll know it's active when `(venv)` appears before your terminal prompt.)

4.  **Install the required Python packages**:
    ```bash
    pip install -r requirements.txt
    ```
5.  **Download the spaCy English language model**:
    This model is necessary for the AI processing.
    ```bash
    python -m spacy download en_core_web_sm
    ```

#### Run the Backend Server

While still in the `backend` directory and with your virtual environment activated:

```bash
python main.py
```
This will start the Flask backend server, typically on `http://127.0.0.1:5001`. Keep this terminal window open and running.

### 3. Set Up and Run the Frontend

The frontend is a Next.js application that provides the user interface for the query tool.

#### Install Node.js Dependencies

1.  Navigate into the `frontend` directory. If you're in the `backend` directory, go up one level then into `frontend`:
    ```bash
    cd ../frontend
    ```
    (Alternatively, if you're already in the project root: `cd frontend`)

2.  **Install the Node.js packages**. You can use either `npm` (Node Package Manager) or `yarn`:

    * **Using npm**:
        ```bash
        npm install
        ```
    * **Using yarn**:
        ```bash
        yarn install # Use --frozen-lockfile if you have a yarn.lock file and want exact dependencies
        ```

#### Configure Backend URL for Frontend

The frontend needs to know the address of the backend. When running locally without Docker, the frontend will call `localhost`.

1.  Open or create a file named `.env.local` in your `frontend` directory.
2.  Add or update the following line in the `.env.local` file:
    ```dotenv
    NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
    ```
    *Note: I use port `5001` for the backend here to avoid potential conflicts with other services that might use `5000` by default. Your backend's `main.py` should be configured to listen on this port.*

#### Run the Frontend Development Server

While still in the `frontend` directory:

* **Using npm**:
    ```bash
    npm run dev
    ```
* **Using yarn**:
    ```bash
    yarn dev
    ```
This will start the Next.js development server, usually on `http://localhost:3000`. Keep this terminal window open and running.

### 4. Access the Application

Once both the backend and frontend servers are running successfully (each in their own terminal window), open your web browser and navigate to:

`http://localhost:3000`

You should now be able to interact with the AI on FHIR Query Tool.

---

### Future Development

This project includes Dockerfiles for containerization. I plan to further refine and document the `docker-compose.yml` setup for easier deployment and streamlined development environments using Docker in the future.
