# ONYE-AI-FHIR - Backend & NLP Integration

This component serves as the Python Flask backend for the ONYE-AI-FHIR project. It is responsible for processing natural language queries using spaCy for NLP, converting them into simulated FHIR API requests, and returning simulated FHIR-like data based on these requests.

## Setup Instructions (Local without Docker)

1.  **Navigate to the project root directory:**
    ```bash
    cd ONYE-AI-FHIR
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python3 -m venv .venv
    # On macOS/Linux:
    source .venv/bin/activate
    # On Windows:
    .venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Download spaCy language model:**
    ```bash
    python -m spacy download en_core_web_sm
    ```

5.  **Run the Flask application:**
    ```bash
    python main.py
    ```
    The server will start on `http://127.0.0.1:5000/`.

## API Endpoint

* **POST `/query`**
    * **Request Body (JSON):**
        ```json
        {
            "query": "Show me all diabetic patients over 50"
        }
        ```
    * **Response (JSON):**
        Contains the NLP parsed request and the simulated FHIR response.

## Example Input/Output (3-5 Queries)

Here are examples of natural language inputs and their corresponding simulated FHIR requests and responses:

**Query 1: "Show me all diabetic patients over 50"**

* **Input:** `"Show me all diabetic patients over 50"`
* **Simulated FHIR Request URL:** `/Patient?condition=DiabetesMellitus&age=gt50`
* **Simulated FHIR Response (truncated for brevity):**
    ```json
    {
        "nlp_parse": {
            "intent": "get_diabetic_patients_over_50",
            "resource_type": "Patient",
            "fhir_params": {
                "condition": "Diabetes Mellitus",
                "age_gt": "50"
            },
            "simulated_fhir_request_url": "Patient?condition=DiabetesMellitus&age=gt50",
            "original_query": "Show me all diabetic patients over 50"
        },
        "simulated_fhir_response": {
            "resourceType": "Bundle",
            "entry": [
                {
                    "resource": {
                        "resourceType": "Patient",
                        "id": "p1",
                        "name": "John Doe",
                        "age": 55,
                        "gender": "male",
                        "conditions": ["Diabetes Mellitus", "Hypertension"]
                    }
                },
                {
                    "resource": {
                        "resourceType": "Patient",
                        "id": "p2",
                        "name": "Jane Smith",
                        "age": 62,
                        "gender": "female",
                        "conditions": ["Diabetes Mellitus"]
                    }
                }
            ]
        }
    }
    ```

**Query 2: "Female patients with asthma"**

* **Input:** `"Female patients with asthma"`
* **Simulated FHIR Request URL:** `/Patient?gender=female&condition=Asthma`
* **Simulated FHIR Response (truncated):**
    ```json
    {
        "nlp_parse": {
            "intent": "get_female_patients_with_asthma",
            "resource_type": "Patient",
            "fhir_params": {
                "gender": "female",
                "condition": "Asthma"
            },
            "simulated_fhir_request_url": "Patient?gender=female&condition=Asthma",
            "original_query": "Female patients with asthma"
        },
        "simulated_fhir_response": {
            "resourceType": "Bundle",
            "entry": [
                {
                    "resource": {
                        "resourceType": "Patient",
                        "id": "p4",
                        "name": "Emily White",
                        "age": 30,
                        "gender": "female",
                        "conditions": ["Asthma"]
                    }
                },
                {
                    "resource": {
                        "resourceType": "Patient",
                        "id": "p5",
                        "name": "Sophia Brown",
                        "age": 40,
                        "gender": "female",
                        "conditions": ["Asthma", "Allergy"]
                    }
                }
            ]
        }
    }
    ```

**Query 3: "What conditions does Alice Smith have?"**

* **Input:** `"What conditions does Alice Smith have?"`
* **Simulated FHIR Request URL:** `/Condition?patient_name=Alice%20Smith`
* **Simulated FHIR Response (truncated):**
    ```json
    {
        "nlp_parse": {
            "intent": "get_patient_conditions",
            "resource_type": "Condition",
            "fhir_params": {
                "patient_name": "Alice Smith"
            },
            "simulated_fhir_request_url": "Condition?patient_name=Alice%20Smith",
            "original_query": "What conditions does Alice Smith have?"
        },
        "simulated_fhir_response": {
            "resourceType": "Bundle",
            "entry": [
                {
                    "resource": {
                        "resourceType": "Patient",
                        "id": "p_alice",
                        "name": "Alice Smith",
                        "age": 45,
                        "gender": "female",
                        "conditions": ["Asthma", "Allergy to Penicillin"]
                    }
                },
                {
                    "resource": {
                        "resourceType": "Condition",
                        "id": "c_asthma",
                        "code": {"text": "Asthma"},
                        "subject": {"reference": "Patient/p_alice", "display": "Alice Smith"}
                    }
                },
                 {
                    "resource": {
                        "resourceType": "Condition",
                        "id": "c_allergy",
                        "code": {"text": "Allergy to Penicillin"},
                        "subject": {"reference": "Patient/p_alice", "display": "Alice Smith"}
                    }
                }
            ]
        }
    }
    ```

## Notes on NLP Implementation

* **Simplicity:** The NLP logic is intentionally simplified for this assessment. In a production environment, this would be significantly more robust, potentially leveraging custom NER models or fine-tuned transformer models.
* **FHIR Mapping:** The mapping from natural language to FHIR parameters is a simulation. A real FHIR API would require precise and often complex parameter constructions.
* **Simulated Data:** The responses are generated from hardcoded dummy data within `main.py` rather than querying a live FHIR server.