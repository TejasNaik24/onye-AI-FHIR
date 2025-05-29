from flask import Flask, request, jsonify
from flask_cors import CORS # Ensure this import is present

app = Flask(__name__)

# --- CONSTANTS ---
# Frontend Origin
CLIENT_ORIGIN = "http://localhost:3000"

# Conditions
CONDITION_DIABETES_MELLITUS = "Diabetes Mellitus"
CONDITION_HYPERTENSION = "Hypertension"
CONDITION_ASTHMA = "Asthma"
CONDITION_ARTHRITIS = "Arthritis"
CONDITION_DEMENTIA = "Dementia"
CONDITION_ALLERGY_PENICILLIN = "Allergy to Penicillin"
CONDITION_ALLERGY = "Allergy" # Used if generic Allergy is needed

# Patient Names (for dummy data)
PATIENT_JOHN_DOE = "John Doe"
PATIENT_JANE_SMITH = "Jane Smith"
PATIENT_ROBERT_GREEN = "Robert Green"
PATIENT_EMILY_WHITE = "Emily White"
PATIENT_SOPHIA_BROWN = "Sophia Brown"
PATIENT_WILLIAM_BLACK = "William Black"
PATIENT_MARY_JONES = "Mary Jones"
PATIENT_ALICE_SMITH = "Alice Smith"

# Genders
GENDER_MALE = "male"
GENDER_FEMALE = "female"

# FHIR related terms (resource types, common keys)
RESOURCE_TYPE_PATIENT = "Patient"
RESOURCE_TYPE_CONDITION = "Condition"
RESOURCE_TYPE_BUNDLE = "Bundle"
FHIR_KEY_RESOURCE_TYPE = "resourceType"
FHIR_KEY_ID = "id"
FHIR_KEY_NAME = "name"
FHIR_KEY_AGE = "age"
FHIR_KEY_GENDER = "gender"
FHIR_KEY_CONDITIONS = "conditions"
FHIR_KEY_RESOURCE = "resource"
FHIR_KEY_ENTRY = "entry"
FHIR_KEY_CODE = "code"
FHIR_KEY_TEXT = "text"
FHIR_KEY_SUBJECT = "subject"
FHIR_KEY_REFERENCE = "reference"
FHIR_KEY_DISPLAY = "display"

# Query related terms
QUERY_KEY_QUERY = "query"
ERROR_NO_QUERY = "No query provided"
NLP_KEY_INTENT = "intent"
NLP_KEY_RESOURCE_TYPE = "resource_type"
NLP_KEY_FHIR_PARAMS = "fhir_params"
NLP_KEY_SIMULATED_FHIR_REQUEST_URL = "simulated_fhir_request_url" # Corrected: URL all caps
NLP_KEY_ORIGINAL_QUERY = "original_query"
NLP_KEY_UNKNOWN_QUERY = "unknown_query"
RESPONSE_KEY_NLP_PARSE = "nlp_parse"
RESPONSE_KEY_SIMULATED_FHIR_RESPONSE = "simulated_fhir_response"


# This line enables CORS for requests from CLIENT_ORIGIN to the /query endpoint.
CORS(app, resources={r"/query": {"origins": CLIENT_ORIGIN}})

# --- Your existing /query route and dummy data ---
@app.route('/query', methods=['POST'])
def handle_query():
    data = request.json
    natural_language_query = data.get(QUERY_KEY_QUERY)

    if not natural_language_query:
        return jsonify({"error": ERROR_NO_QUERY}), 400

    # SIMULATED NLP PROCESSING AND FHIR RESPONSE (YOUR BACKEND LOGIC)
    nlp_parse = {
        NLP_KEY_INTENT: NLP_KEY_UNKNOWN_QUERY, # Default to unknown
        NLP_KEY_RESOURCE_TYPE: "N/A", # Default
        NLP_KEY_FHIR_PARAMS: {},
        NLP_KEY_SIMULATED_FHIR_REQUEST_URL: "N/A", # Corrected usage here
        NLP_KEY_ORIGINAL_QUERY: natural_language_query
    }
    simulated_fhir_response = {
        FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_BUNDLE,
        FHIR_KEY_ENTRY: []
    }

    # Example logic to simulate responses based on query keywords
    if "diabetic patients over 50" in natural_language_query.lower():
        nlp_parse[NLP_KEY_INTENT] = "get_diabetic_patients_over_50"
        nlp_parse[NLP_KEY_RESOURCE_TYPE] = RESOURCE_TYPE_PATIENT
        nlp_parse[NLP_KEY_FHIR_PARAMS] = {FHIR_KEY_CONDITIONS: CONDITION_DIABETES_MELLITUS, FHIR_KEY_AGE: "50"}
        nlp_parse[NLP_KEY_SIMULATED_FHIR_REQUEST_URL] = "Patient?condition=DiabetesMellitus&age=gt50" # Corrected usage here
        simulated_fhir_response[FHIR_KEY_ENTRY] = [
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_PATIENT, FHIR_KEY_ID: "p1", FHIR_KEY_NAME: PATIENT_JOHN_DOE, FHIR_KEY_AGE: 55, FHIR_KEY_GENDER: GENDER_MALE, FHIR_KEY_CONDITIONS: [CONDITION_DIABETES_MELLITUS, CONDITION_HYPERTENSION]}},
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_PATIENT, FHIR_KEY_ID: "p2", FHIR_KEY_NAME: PATIENT_JANE_SMITH, FHIR_KEY_AGE: 62, FHIR_KEY_GENDER: GENDER_FEMALE, FHIR_KEY_CONDITIONS: [CONDITION_DIABETES_MELLITUS]}}
        ]
    elif "patients over 60 with hypertension" in natural_language_query.lower():
        nlp_parse[NLP_KEY_INTENT] = "get_hypertensive_patients_over_60"
        nlp_parse[NLP_KEY_RESOURCE_TYPE] = RESOURCE_TYPE_PATIENT
        nlp_parse[NLP_KEY_FHIR_PARAMS] = {FHIR_KEY_CONDITIONS: CONDITION_HYPERTENSION, FHIR_KEY_AGE: "60"}
        nlp_parse[NLP_KEY_SIMULATED_FHIR_REQUEST_URL] = "Patient?condition=Hypertension&age=gt60" # Corrected usage here
        simulated_fhir_response[FHIR_KEY_ENTRY] = [
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_PATIENT, FHIR_KEY_ID: "p3", FHIR_KEY_NAME: PATIENT_ROBERT_GREEN, FHIR_KEY_AGE: 65, FHIR_KEY_GENDER: GENDER_MALE, FHIR_KEY_CONDITIONS: [CONDITION_HYPERTENSION, CONDITION_ASTHMA]}}
        ]
    elif "female patients with asthma" in natural_language_query.lower():
        nlp_parse[NLP_KEY_INTENT] = "get_female_patients_with_asthma"
        nlp_parse[NLP_KEY_RESOURCE_TYPE] = RESOURCE_TYPE_PATIENT
        nlp_parse[NLP_KEY_FHIR_PARAMS] = {FHIR_KEY_GENDER: GENDER_FEMALE, FHIR_KEY_CONDITIONS: CONDITION_ASTHMA}
        simulated_fhir_response[FHIR_KEY_ENTRY] = [
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_PATIENT, FHIR_KEY_ID: "p4", FHIR_KEY_NAME: PATIENT_EMILY_WHITE, FHIR_KEY_AGE: 30, FHIR_KEY_GENDER: GENDER_FEMALE, FHIR_KEY_CONDITIONS: [CONDITION_ASTHMA]}},
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_PATIENT, FHIR_KEY_ID: "p5", FHIR_KEY_NAME: PATIENT_SOPHIA_BROWN, FHIR_KEY_AGE: 40, FHIR_KEY_GENDER: GENDER_FEMALE, FHIR_KEY_CONDITIONS: [CONDITION_ASTHMA, CONDITION_ALLERGY]}}
        ]
    elif "what conditions does alice smith have?" in natural_language_query.lower():
        nlp_parse[NLP_KEY_INTENT] = "get_patient_conditions"
        nlp_parse[NLP_KEY_RESOURCE_TYPE] = RESOURCE_TYPE_CONDITION # Or Patient, depending on how you want to present
        nlp_parse[NLP_KEY_FHIR_PARAMS] = {FHIR_KEY_NAME: PATIENT_ALICE_SMITH}
        simulated_fhir_response[FHIR_KEY_ENTRY] = [
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_PATIENT, FHIR_KEY_ID: "p_alice", FHIR_KEY_NAME: PATIENT_ALICE_SMITH, FHIR_KEY_AGE: 45, FHIR_KEY_GENDER: GENDER_FEMALE, FHIR_KEY_CONDITIONS: [CONDITION_ASTHMA, CONDITION_ALLERGY_PENICILLIN]}},
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_CONDITION, FHIR_KEY_ID: "c_asthma", FHIR_KEY_CODE: {FHIR_KEY_TEXT: CONDITION_ASTHMA}, FHIR_KEY_SUBJECT: {FHIR_KEY_REFERENCE: "Patient/p_alice", FHIR_KEY_DISPLAY: PATIENT_ALICE_SMITH}}},
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_CONDITION, FHIR_KEY_ID: "c_allergy", FHIR_KEY_CODE: {FHIR_KEY_TEXT: CONDITION_ALLERGY_PENICILLIN}, FHIR_KEY_SUBJECT: {FHIR_KEY_REFERENCE: "Patient/p_alice", FHIR_KEY_DISPLAY: PATIENT_ALICE_SMITH}}}
        ]
    elif "patients over 70" in natural_language_query.lower():
        nlp_parse[NLP_KEY_INTENT] = "get_patients_over_70"
        nlp_parse[NLP_KEY_RESOURCE_TYPE] = RESOURCE_TYPE_PATIENT
        nlp_parse[NLP_KEY_FHIR_PARAMS] = {FHIR_KEY_AGE: "70"}
        simulated_fhir_response[FHIR_KEY_ENTRY] = [
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_PATIENT, FHIR_KEY_ID: "p6", FHIR_KEY_NAME: PATIENT_WILLIAM_BLACK, FHIR_KEY_AGE: 75, FHIR_KEY_GENDER: GENDER_MALE, FHIR_KEY_CONDITIONS: [CONDITION_ARTHRITIS]}},
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_PATIENT, FHIR_KEY_ID: "p7", FHIR_KEY_NAME: PATIENT_MARY_JONES, FHIR_KEY_AGE: 80, FHIR_KEY_GENDER: GENDER_FEMALE, FHIR_KEY_CONDITIONS: [CONDITION_DEMENTIA]}}
        ]
    elif "male patients" in natural_language_query.lower():
        nlp_parse[NLP_KEY_INTENT] = "get_male_patients"
        nlp_parse[NLP_KEY_RESOURCE_TYPE] = RESOURCE_TYPE_PATIENT
        nlp_parse[NLP_KEY_FHIR_PARAMS] = {FHIR_KEY_GENDER: GENDER_MALE} # FIXED: Added '=' here
        simulated_fhir_response[FHIR_KEY_ENTRY] = [
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_PATIENT, FHIR_KEY_ID: "p1", FHIR_KEY_NAME: PATIENT_JOHN_DOE, FHIR_KEY_AGE: 55, FHIR_KEY_GENDER: GENDER_MALE, FHIR_KEY_CONDITIONS: [CONDITION_DIABETES_MELLITUS, CONDITION_HYPERTENSION]}},
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_PATIENT, FHIR_KEY_ID: "p3", FHIR_KEY_NAME: PATIENT_ROBERT_GREEN, FHIR_KEY_AGE: 65, FHIR_KEY_GENDER: GENDER_MALE, FHIR_KEY_CONDITIONS: [CONDITION_HYPERTENSION, CONDITION_ASTHMA]}},
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_PATIENT, FHIR_KEY_ID: "p6", FHIR_KEY_NAME: PATIENT_WILLIAM_BLACK, FHIR_KEY_AGE: 75, FHIR_KEY_GENDER: GENDER_MALE, FHIR_KEY_CONDITIONS: [CONDITION_ARTHRITIS]}}
        ]
    elif "all patients" in natural_language_query.lower():
        nlp_parse[NLP_KEY_INTENT] = "get_all_patients"
        nlp_parse[NLP_KEY_RESOURCE_TYPE] = RESOURCE_TYPE_PATIENT
        nlp_parse[NLP_KEY_FHIR_PARAMS] = {}
        simulated_fhir_response[FHIR_KEY_ENTRY] = [
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_PATIENT, FHIR_KEY_ID: "p1", FHIR_KEY_NAME: PATIENT_JOHN_DOE, FHIR_KEY_AGE: 55, FHIR_KEY_GENDER: GENDER_MALE, FHIR_KEY_CONDITIONS: [CONDITION_DIABETES_MELLITUS, CONDITION_HYPERTENSION]}},
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_PATIENT, FHIR_KEY_ID: "p2", FHIR_KEY_NAME: PATIENT_JANE_SMITH, FHIR_KEY_AGE: 62, FHIR_KEY_GENDER: GENDER_FEMALE, FHIR_KEY_CONDITIONS: [CONDITION_DIABETES_MELLITUS]}},
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_PATIENT, FHIR_KEY_ID: "p3", FHIR_KEY_NAME: PATIENT_ROBERT_GREEN, FHIR_KEY_AGE: 65, FHIR_KEY_GENDER: GENDER_MALE, FHIR_KEY_CONDITIONS: [CONDITION_HYPERTENSION, CONDITION_ASTHMA]}},
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_PATIENT, FHIR_KEY_ID: "p4", FHIR_KEY_NAME: PATIENT_EMILY_WHITE, FHIR_KEY_AGE: 30, FHIR_KEY_GENDER: GENDER_FEMALE, FHIR_KEY_CONDITIONS: [CONDITION_ASTHMA]}},
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_PATIENT, FHIR_KEY_ID: "p5", FHIR_KEY_NAME: PATIENT_SOPHIA_BROWN, FHIR_KEY_AGE: 40, FHIR_KEY_GENDER: GENDER_FEMALE, FHIR_KEY_CONDITIONS: [CONDITION_ASTHMA, CONDITION_ALLERGY]}},
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_PATIENT, FHIR_KEY_ID: "p6", FHIR_KEY_NAME: PATIENT_WILLIAM_BLACK, FHIR_KEY_AGE: 75, FHIR_KEY_GENDER: GENDER_MALE, FHIR_KEY_CONDITIONS: [CONDITION_ARTHRITIS]}},
            {FHIR_KEY_RESOURCE: {FHIR_KEY_RESOURCE_TYPE: RESOURCE_TYPE_PATIENT, FHIR_KEY_ID: "p7", FHIR_KEY_NAME: PATIENT_MARY_JONES, FHIR_KEY_AGE: 80, FHIR_KEY_GENDER: GENDER_FEMALE, FHIR_KEY_CONDITIONS: [CONDITION_DEMENTIA]}}
        ]
    else:
        # Default response if no specific query matched
        # Default values already set at the top of the function
        pass # No change needed as initial nlp_parse and simulated_fhir_response are set to default

    response_payload = {
        RESPONSE_KEY_NLP_PARSE: nlp_parse,
        RESPONSE_KEY_SIMULATED_FHIR_RESPONSE: simulated_fhir_response
    }

    return jsonify(response_payload)

if __name__ == '__main__':
    # It's good practice to bind to 0.0.0.0 if you might access it from other devices on your network
    # or if localhost has weird resolution issues sometimes. But 127.0.0.1 is usually fine.
    app.run(debug=True, host='127.0.0.1', port=5000)