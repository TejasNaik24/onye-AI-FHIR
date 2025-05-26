# ONYE-AI-FHIR Take-Home Assessment

This repository contains a full-stack application for querying simulated healthcare data using natural language, integrating AI (NLP), and showcasing a user-friendly frontend. It also includes a security and compliance plan, Internationalization (i18n) for the UI, and Docker containerization.

## Project Structure

* `.venv/`: Python virtual environment (for local backend development).
* `frontend/`: Contains the React/Next.js frontend UI.
* `main.py`: The Python Flask backend service for NLP integration and simulated FHIR data querying.
* `requirements.txt`: Python dependencies for the backend.
* `Dockerfile`: Dockerfile for containerizing the Python Flask backend.
* `docker-compose.yml`: Defines how to build and run both the backend and frontend services using Docker Compose.
* `SECURITY_PLAN.md`: Technical document outlining security and HIPAA compliance measures.
* `README.md`: This overall project README.
* `BACKEND_README.md`: Detailed README for the backend component.
* `frontend/README.md`: Detailed README for the frontend component.

## Setup and Running Instructions

**Prerequisites:**
* Python 3.9+
* Node.js 18+ and npm/yarn
* Docker Desktop (installed and running with user logged in)

### Option 1: Running with Docker Compose (Recommended)

This is the easiest way to get both services running together.

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-link>
    cd ONYE-AI-FHIR
    ```
2.  **Build and run all services:**
    ```bash
    docker-compose up --build
    ```
    * **Note on potential Docker login issue:** If you encounter a `401 Unauthorized` error during the build, ensure Docker Desktop is running and you are properly logged in within the Docker Desktop application itself. If it persists, there might be a system-level Docker credential issue on your machine that requires troubleshooting independent of the project code.
    * The backend will be accessible on `http://localhost:5000` (within the Docker network, the frontend communicates with it via `http://backend:5000`).
    * The frontend will be accessible on `http://localhost:3000`.

### Option 2: Running without Docker (Manual Local Setup)

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-link>
    cd ONYE-AI-FHIR
    ```

2.  **Setup and run the Backend (Python Flask):**
    * Navigate to the root project directory:
        ```bash
        cd ONYE-AI-FHIR
        ```
    * Create and activate a virtual environment:
        ```bash
        python3 -m venv .venv
        source .venv/bin/activate
        ```
    * Install Python dependencies:
        ```bash
        pip install -r requirements.txt
        ```
    * Download spaCy language model:
        ```bash
        python -m spacy download en_core_web_sm
        ```
    * Run the Flask application:
        ```bash
        python main.py
        ```
        (Keep this terminal window open and running.)

3.  **Setup and run the Frontend (React/Next.js):**
    * Open a **new, separate terminal window**.
    * Navigate to the frontend directory:
        ```bash
        cd ONYE-AI-FHIR/frontend
        ```
    * Install Node.js dependencies:
        ```bash
        npm install
        ```
    * Run the development server:
        ```bash
        npm run dev
        ```
        (Keep this terminal window open and running.)

## Deliverables Overview

* **Backend & NLP Integration:** See `BACKEND_README.md` for details.
* **Front-End UI:** See `frontend/README.md` for details.
* **Security & Compliance:** See `SECURITY_PLAN.md` for the detailed plan.
* **Bonus - Internationalization (i18n):** Implemented in `frontend/src/app/page.tsx` and `frontend/public/locales/`.
* **Bonus - Docker Containerization:** `Dockerfile` (for backend), `frontend/Dockerfile` (for frontend), and `docker-compose.yml`.

## Notes on What I Focused On / Would Improve

### What I Focused On:
* **Core Functionality:** Successfully converting natural language queries into simulated FHIR requests and displaying results.
* **User Experience:** Providing a clear UI with query auto-complete/suggestions and intuitive data visualization (charts & table).
* **Security Foundation:** Outlining a comprehensive security plan addressing HIPAA requirements.
* **Demonstrability:** Ensuring the project is easy to set up and run with clear instructions and Docker support.
* **Scalability & Maintainability:** Using a modular project structure and standard, widely adopted technologies (Flask, Next.js, spaCy).
* **Internationalization:** Implementing multi-language support for better accessibility.

### What I Would Improve with More Time:
* **Advanced NLP:** Implement more sophisticated intent recognition and entity extraction using custom spaCy models or fine-tuned transformer models for higher accuracy and broader coverage. Integrate with a clinical terminology service (like SNOMED CT or LOINC) for standardized code mapping.
* **Richer FHIR Simulation:** Implement a more comprehensive FHIR server simulation with a larger and more diverse dataset. Support more FHIR resources (e.g., `Observation`, `MedicationRequest`, `DiagnosticReport`) and complex search parameters.
* **Enhanced Frontend:** Implement client-side filters, more interactive charts, robust error handling, and accessibility improvements.
* **Authentication Integration:** For a real application, integrate with a dummy OAuth 2.0 / SMART on FHIR server (e.g., Keycloak) to demonstrate actual authentication flows and consent.
* **Comprehensive Testing:** Add extensive unit, integration, and end-to-end tests for both backend and frontend components.
* **Deployment Automation:** Set up CI/CD pipelines for automated testing and deployment to cloud platforms.