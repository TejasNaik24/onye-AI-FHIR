# ONYE-AI-FHIR - Front-End UI

This is the React/Next.js frontend for the ONYE-AI-FHIR project. It provides a user interface to input natural language queries, send them to the Python backend, and display the simulated FHIR results in a user-friendly format, including charts and tables, with multi-language support.

## Features

* **Natural Language Query Input:** An input field for users to type their queries.
* **Query Auto-complete/Suggestions:** Provides a list of suggested queries that are also translated based on the selected language.
* **Dynamic Result Display:** Shows NLP analysis from the backend and the simulated FHIR data.
* **Data Visualization:** Displays patient age distribution (Bar Chart) and condition distribution (Pie Chart) for patient-related queries.
* **Tabular Data Display:** Presents detailed patient/condition information in a structured table format.
* **Internationalization (i18n):** Supports English, Spanish, and French for the entire user interface.

## Setup Instructions (Local without Docker)

1.  **Navigate to the frontend project directory:**
    ```bash
    cd ONYE-AI-FHIR/frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will be accessible at `http://localhost:3000`.

    **Important:** Ensure your Python backend is running on `http://127.0.0.1:5000/` for the frontend to communicate successfully.

## Screenshots (or Live Link)

*(When your app is fully working, take screenshots and add them here. Ensure one shows the i18n in action!)*

![Screenshot of the UI with English selected and results displayed](./screenshots/english-results.png)
*Figure 1: Application UI in English with Query Results*

![Screenshot of the UI with Spanish selected and suggestions displayed](./screenshots/2025-05-26 at 2.35.07 AM.png)
*Figure 2: Application UI in Spanish with Translated Suggestions*