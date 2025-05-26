from flask import Flask, request, jsonify
from flask_cors import CORS # Ensure this import is present

app = Flask(__name__)
# This line enables CORS for requests from http://localhost:3000 to the /query endpoint.
# Make sure your Next.js frontend is indeed running on http://localhost:3000.
# If you decide to deploy, you would change "http://localhost:3000" to your actual frontend domain.
CORS(app, resources={r"/query": {"origins": "http://localhost:3000"}})

# --- Your existing /query route and dummy data ---
@app.route('/query', methods=['POST'])
def handle_query():
    data = request.json
    natural_language_query = data.get('query')

    if not natural_language_query:
        return jsonify({"error": "No query provided"}), 400

    # SIMULATED NLP PROCESSING AND FHIR RESPONSE (YOUR BACKEND LOGIC)
    # This is dummy data. You will integrate your actual NLP logic here
    # to convert natural language queries into the appropriate FHIR parameters
    # and then simulate a FHIR API response based on your defined patient/condition data.

    nlp_parse = {
        "intent": "retrieve_patients",
        "resource_type": "Patient",
        "fhir_params": {},
        "simulated_fhir_request_url": "",
        "original_query": natural_language_query
    }
    simulated_fhir_response = {
        "resourceType": "Bundle",
        "entry": []
    }

    # Example logic to simulate responses based on query keywords
    if "diabetic patients over 50" in natural_language_query.lower():
        nlp_parse["intent"] = "get_diabetic_patients_over_50"
        nlp_parse["resource_type"] = "Patient"
        nlp_parse["fhir_params"] = {"condition": "Diabetes Mellitus", "age_gt": "50"}
        nlp_parse["simulated_fhir_request_url"] = "Patient?condition=DiabetesMellitus&age=gt50"
        simulated_fhir_response["entry"] = [
            {"resource": {"resourceType": "Patient", "id": "p1", "name": "John Doe", "age": 55, "gender": "male", "conditions": ["Diabetes Mellitus", "Hypertension"]}},
            {"resource": {"resourceType": "Patient", "id": "p2", "name": "Jane Smith", "age": 62, "gender": "female", "conditions": ["Diabetes Mellitus"]}}
        ]
    elif "patients over 60 with hypertension" in natural_language_query.lower():
        nlp_parse["intent"] = "get_hypertensive_patients_over_60"
        nlp_parse["resource_type"] = "Patient"
        nlp_parse["fhir_params"] = {"condition": "Hypertension", "age_gt": "60"}
        nlp_parse["simulated_fhir_request_url"] = "Patient?condition=Hypertension&age=gt60"
        simulated_fhir_response["entry"] = [
            {"resource": {"resourceType": "Patient", "id": "p3", "name": "Robert Green", "age": 65, "gender": "male", "conditions": ["Hypertension", "Asthma"]}}
        ]
    elif "female patients with asthma" in natural_language_query.lower():
        nlp_parse["intent"] = "get_female_patients_with_asthma"
        nlp_parse["resource_type"] = "Patient"
        nlp_parse["fhir_params"] = {"gender": "female", "condition": "Asthma"}
        simulated_fhir_response["entry"] = [
            {"resource": {"resourceType": "Patient", "id": "p4", "name": "Emily White", "age": 30, "gender": "female", "conditions": ["Asthma"]}},
            {"resource": {"resourceType": "Patient", "id": "p5", "name": "Sophia Brown", "age": 40, "gender": "female", "conditions": ["Asthma", "Allergy"]}}
        ]
    elif "what conditions does alice smith have?" in natural_language_query.lower():
        nlp_parse["intent"] = "get_patient_conditions"
        nlp_parse["resource_type"] = "Condition" # Or Patient, depending on how you want to present
        nlp_parse["fhir_params"] = {"patient_name": "Alice Smith"}
        simulated_fhir_response["entry"] = [
            {"resource": {"resourceType": "Patient", "id": "p_alice", "name": "Alice Smith", "age": 45, "gender": "female", "conditions": ["Asthma", "Allergy to Penicillin"]}},
            {"resource": {"resourceType": "Condition", "id": "c_asthma", "code": {"text": "Asthma"}, "subject": {"reference": "Patient/p_alice", "display": "Alice Smith"}}},
            {"resource": {"resourceType": "Condition", "id": "c_allergy", "code": {"text": "Allergy to Penicillin"}, "subject": {"reference": "Patient/p_alice", "display": "Alice Smith"}}}
        ]
    elif "patients over 70" in natural_language_query.lower():
        nlp_parse["intent"] = "get_patients_over_70"
        nlp_parse["resource_type"] = "Patient"
        nlp_parse["fhir_params"] = {"age_gt": "70"}
        simulated_fhir_response["entry"] = [
            {"resource": {"resourceType": "Patient", "id": "p6", "name": "William Black", "age": 75, "gender": "male", "conditions": ["Arthritis"]}},
            {"resource": {"resourceType": "Patient", "id": "p7", "name": "Mary Jones", "age": 80, "gender": "female", "conditions": ["Dementia"]}}
        ]
    elif "male patients" in natural_language_query.lower():
        nlp_parse["intent"] = "get_male_patients"
        nlp_parse["resource_type"] = "Patient"
        nlp_parse["fhir_params"] = {"gender": "male"}
        simulated_fhir_response["entry"] = [
            {"resource": {"resourceType": "Patient", "id": "p1", "name": "John Doe", "age": 55, "gender": "male", "conditions": ["Diabetes Mellitus", "Hypertension"]}},
            {"resource": {"resourceType": "Patient", "id": "p3", "name": "Robert Green", "age": 65, "gender": "male", "conditions": ["Hypertension", "Asthma"]}},
            {"resource": {"resourceType": "Patient", "id": "p6", "name": "William Black", "age": 75, "gender": "male", "conditions": ["Arthritis"]}}
        ]
    elif "all patients" in natural_language_query.lower():
        nlp_parse["intent"] = "get_all_patients"
        nlp_parse["resource_type"] = "Patient"
        nlp_parse["fhir_params"] = {}
        simulated_fhir_response["entry"] = [
            {"resource": {"resourceType": "Patient", "id": "p1", "name": "John Doe", "age": 55, "gender": "male", "conditions": ["Diabetes Mellitus", "Hypertension"]}},
            {"resource": {"resourceType": "Patient", "id": "p2", "name": "Jane Smith", "age": 62, "gender": "female", "conditions": ["Diabetes Mellitus"]}},
            {"resource": {"resourceType": "Patient", "id": "p3", "name": "Robert Green", "age": 65, "gender": "male", "conditions": ["Hypertension", "Asthma"]}},
            {"resource": {"resourceType": "Patient", "id": "p4", "name": "Emily White", "age": 30, "gender": "female", "conditions": ["Asthma"]}},
            {"resource": {"resourceType": "Patient", "id": "p5", "name": "Sophia Brown", "age": 40, "gender": "female", "conditions": ["Asthma", "Allergy"]}},
            {"resource": {"resourceType": "Patient", "id": "p6", "name": "William Black", "age": 75, "gender": "male", "conditions": ["Arthritis"]}},
            {"resource": {"resourceType": "Patient", "id": "p7", "name": "Mary Jones", "age": 80, "gender": "female", "conditions": ["Dementia"]}}
        ]
    else:
        # Default response if no specific query matched
        nlp_parse["intent"] = "unknown_query"
        nlp_parse["resource_type"] = "N/A"
        nlp_parse["fhir_params"] = {}
        nlp_parse["simulated_fhir_request_url"] = "N/A"
        simulated_fhir_response = {
            "resourceType": "Bundle",
            "entry": []
        }

    response_payload = {
        "nlp_parse": nlp_parse,
        "simulated_fhir_response": simulated_fhir_response
    }

    return jsonify(response_payload)

if __name__ == '__main__':
    # It's good practice to bind to 0.0.0.0 if you might access it from other devices on your network
    # or if localhost has weird resolution issues sometimes. But 127.0.0.1 is usually fine.
    app.run(debug=True, host='127.0.0.1', port=5000)