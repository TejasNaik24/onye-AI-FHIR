"use client"; // This is crucial for client-side functionality like state and effects

import { useState, useRef, useEffect, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
// --- i18n Imports ---
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
// Import your translation files directly
import enCommon from '../../public/locales/en/common.json';
import esCommon from '../../public/locales/es/common.json';
import frCommon from '../../public/locales/fr/common.json'; // Add if you're including French

// Configure i18next
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: { common: enCommon }, // 'common' is our namespace
      es: { common: esCommon },
      fr: { common: frCommon }, // Add French resources
    },
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language if translation is missing
    defaultNS: 'common', // default namespace to use
    interpolation: {
      escapeValue: false, // react already protects against XSS
    },
  });


// Register Chart.js components.
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// --- Interface Definitions for Data Structure ---
interface Patient {
    id: string; // Ensure patient ID is part of the interface
    name: string;
    age: number;
    gender: string;
    conditions: string[];
}

interface FHIRResponse {
    resourceType: string;
    entry: { resource: any }[];
}

interface NLPParse {
    intent: string;
    resource_type: string;
    fhir_params: { [key: string]: string };
    simulated_fhir_request_url: string;
    original_query: string;
}

interface BackendResponse {
    nlp_parse: NLPParse;
    simulated_fhir_response: FHIRResponse;
}

// NEW INTERFACES FOR TABLE DATA - ADDING 'id'
interface PatientTableData {
    id: string; // Added for unique key
    name: string;
    age: number;
    gender: string;
    conditions: string; // conditions is joined as string
}

interface ConditionTableData {
    id: string; // Added for unique key (using condition ID)
    patientName: string;
    condition: string;
}

// --- Example Query Suggestion KEYS for Auto-complete ---
// These are now keys that will be translated by i18next
const querySuggestionKeys = [
    "suggestion_diabetic_over_50",
    "suggestion_hypertension_over_60",
    "suggestion_female_asthma",
    "suggestion_alice_smith_conditions",
    "suggestion_patients_over_70",
    "suggestion_male_patients",
    "suggestion_all_patients"
];

// --- Helper Function to Simulate Backend Response (extracted for complexity) ---
function getSimulatedBackendResponse(naturalLanguageQuery: string): BackendResponse {
    const nlp_parse: NLPParse = {
        intent: "unknown_query", // Default to unknown
        resource_type: "N/A", // Default
        fhir_params: {},
        simulated_fhir_request_url: "N/A",
        original_query: naturalLanguageQuery
    };
    const simulated_fhir_response: FHIRResponse = {
        resourceType: "Bundle",
        entry: []
    };

    // Placeholder constants for conditions and patient names (replace with your actual constants)
    const CONDITION_DIABETES_MELLITUS = "Diabetes Mellitus";
    const CONDITION_HYPERTENSION = "Hypertension";
    const CONDITION_ASTHMA = "Asthma";
    const CONDITION_ARTHRITIS = "Arthritis";
    const CONDITION_DEMENTIA = "Dementia";
    const CONDITION_ALLERGY = "Allergy";
    const CONDITION_ALLERGY_PENICILLIN = "Allergy to Penicillin";

    const PATIENT_JOHN_DOE = "John Doe";
    const PATIENT_JANE_SMITH = "Jane Smith";
    const PATIENT_ROBERT_GREEN = "Robert Green";
    const PATIENT_EMILY_WHITE = "Emily White";
    const PATIENT_SOPHIA_BROWN = "Sophia Brown";
    const PATIENT_WILLIAM_BLACK = "William Black";
    const PATIENT_MARY_JONES = "Mary Jones";
    const PATIENT_ALICE_SMITH = "Alice Smith";

    const GENDER_MALE = "male";
    const GENDER_FEMALE = "female";
    const RESOURCE_TYPE_PATIENT = "Patient";
    const RESOURCE_TYPE_CONDITION = "Condition";

    if (naturalLanguageQuery.toLowerCase().includes("diabetic patients over 50")) {
        nlp_parse.intent = "get_diabetic_patients_over_50";
        nlp_parse.resource_type = RESOURCE_TYPE_PATIENT;
        nlp_parse.fhir_params = { conditions: CONDITION_DIABETES_MELLITUS, age: "50" };
        nlp_parse.simulated_fhir_request_url = "Patient?condition=DiabetesMellitus&age=gt50";
        simulated_fhir_response.entry = [
            { resource: { resourceType: RESOURCE_TYPE_PATIENT, id: "p1", name: PATIENT_JOHN_DOE, age: 55, gender: GENDER_MALE, conditions: [CONDITION_DIABETES_MELLITUS, CONDITION_HYPERTENSION] } },
            { resource: { resourceType: RESOURCE_TYPE_PATIENT, id: "p2", name: PATIENT_JANE_SMITH, age: 62, gender: GENDER_FEMALE, conditions: [CONDITION_DIABETES_MELLITUS] } }
        ];
    } else if (naturalLanguageQuery.toLowerCase().includes("patients over 60 with hypertension")) {
        nlp_parse.intent = "get_hypertensive_patients_over_60";
        nlp_parse.resource_type = RESOURCE_TYPE_PATIENT;
        nlp_parse.fhir_params = { conditions: CONDITION_HYPERTENSION, age: "60" };
        nlp_parse.simulated_fhir_request_url = "Patient?condition=Hypertension&age=gt60";
        simulated_fhir_response.entry = [
            { resource: { resourceType: RESOURCE_TYPE_PATIENT, id: "p3", name: PATIENT_ROBERT_GREEN, age: 65, gender: GENDER_MALE, conditions: [CONDITION_HYPERTENSION, CONDITION_ASTHMA] } }
        ];
    } else if (naturalLanguageQuery.toLowerCase().includes("female patients with asthma")) {
        nlp_parse.intent = "get_female_patients_with_asthma";
        nlp_parse.resource_type = RESOURCE_TYPE_PATIENT;
        nlp_parse.fhir_params = { gender: GENDER_FEMALE, conditions: CONDITION_ASTHMA };
        simulated_fhir_response.entry = [
            { resource: { resourceType: RESOURCE_TYPE_PATIENT, id: "p4", name: PATIENT_EMILY_WHITE, age: 30, gender: GENDER_FEMALE, conditions: [CONDITION_ASTHMA] } },
            { resource: { resourceType: RESOURCE_TYPE_PATIENT, id: "p5", name: PATIENT_SOPHIA_BROWN, age: 40, gender: GENDER_FEMALE, conditions: [CONDITION_ASTHMA, CONDITION_ALLERGY] } }
        ];
    } else if (naturalLanguageQuery.toLowerCase().includes("what conditions does alice smith have?")) {
        nlp_parse.intent = "get_patient_conditions";
        nlp_parse.resource_type = RESOURCE_TYPE_CONDITION;
        nlp_parse.fhir_params = { name: PATIENT_ALICE_SMITH };
        simulated_fhir_response.entry = [
            { resource: { resourceType: RESOURCE_TYPE_PATIENT, id: "p_alice", name: PATIENT_ALICE_SMITH, age: 45, gender: GENDER_FEMALE, conditions: [CONDITION_ASTHMA, CONDITION_ALLERGY_PENICILLIN] } },
            { resource: { resourceType: RESOURCE_TYPE_CONDITION, id: "c_asthma", code: { text: CONDITION_ASTHMA }, subject: { reference: "Patient/p_alice", display: PATIENT_ALICE_SMITH } } },
            { resource: { resourceType: RESOURCE_TYPE_CONDITION, id: "c_allergy", code: { text: CONDITION_ALLERGY_PENICILLIN }, subject: { reference: "Patient/p_alice", display: PATIENT_ALICE_SMITH } } }
        ];
    } else if (naturalLanguageQuery.toLowerCase().includes("patients over 70")) {
        nlp_parse.intent = "get_patients_over_70";
        nlp_parse.resource_type = RESOURCE_TYPE_PATIENT;
        nlp_parse.fhir_params = { age: "70" };
        simulated_fhir_response.entry = [
            { resource: { resourceType: RESOURCE_TYPE_PATIENT, id: "p6", name: PATIENT_WILLIAM_BLACK, age: 75, gender: GENDER_MALE, conditions: [CONDITION_ARTHRITIS] } },
            { resource: { resourceType: RESOURCE_TYPE_PATIENT, id: "p7", name: PATIENT_MARY_JONES, age: 80, gender: GENDER_FEMALE, conditions: [CONDITION_DEMENTIA] } }
        ];
    } else if (naturalLanguageQuery.toLowerCase().includes("male patients")) {
        nlp_parse.intent = "get_male_patients";
        nlp_parse.resource_type = RESOURCE_TYPE_PATIENT;
        nlp_parse.fhir_params = { gender: GENDER_MALE };
        simulated_fhir_response.entry = [
            { resource: { resourceType: RESOURCE_TYPE_PATIENT, id: "p1", name: PATIENT_JOHN_DOE, age: 55, gender: GENDER_MALE, conditions: [CONDITION_DIABETES_MELLITUS, CONDITION_HYPERTENSION] } },
            { resource: { resourceType: RESOURCE_TYPE_PATIENT, id: "p3", name: PATIENT_ROBERT_GREEN, age: 65, gender: GENDER_MALE, conditions: [CONDITION_HYPERTENSION, CONDITION_ASTHMA] } },
            { resource: { resourceType: RESOURCE_TYPE_PATIENT, id: "p6", name: PATIENT_WILLIAM_BLACK, age: 75, gender: GENDER_MALE, conditions: [CONDITION_ARTHRITIS] } }
        ];
    } else if (naturalLanguageQuery.toLowerCase().includes("all patients")) {
        nlp_parse.intent = "get_all_patients";
        nlp_parse.resource_type = RESOURCE_TYPE_PATIENT;
        nlp_parse.fhir_params = {};
        simulated_fhir_response.entry = [
            { resource: { resourceType: RESOURCE_TYPE_PATIENT, id: "p1", name: PATIENT_JOHN_DOE, age: 55, gender: GENDER_MALE, conditions: [CONDITION_DIABETES_MELLITUS, CONDITION_HYPERTENSION] } },
            { resource: { resourceType: RESOURCE_TYPE_PATIENT, id: "p2", name: PATIENT_JANE_SMITH, age: 62, gender: GENDER_FEMALE, conditions: [CONDITION_DIABETES_MELLITUS] } },
            { resource: { resourceType: RESOURCE_TYPE_PATIENT, id: "p3", name: PATIENT_ROBERT_GREEN, age: 65, gender: GENDER_MALE, conditions: [CONDITION_HYPERTENSION, CONDITION_ASTHMA] } },
            { resource: { resourceType: RESOURCE_TYPE_PATIENT, id: "p4", name: PATIENT_EMILY_WHITE, age: 30, gender: GENDER_FEMALE, conditions: [CONDITION_ASTHMA] } },
            { resource: { resourceType: RESOURCE_TYPE_PATIENT, id: "p5", name: PATIENT_SOPHIA_BROWN, age: 40, gender: GENDER_FEMALE, conditions: [CONDITION_ASTHMA, CONDITION_ALLERGY] } },
            { resource: { resourceType: RESOURCE_TYPE_PATIENT, id: "p6", name: PATIENT_WILLIAM_BLACK, age: 75, gender: GENDER_MALE, conditions: [CONDITION_ARTHRITIS] } },
            { resource: { resourceType: RESOURCE_TYPE_PATIENT, id: "p7", name: PATIENT_MARY_JONES, age: 80, gender: GENDER_FEMALE, conditions: [CONDITION_DEMENTIA] } }
        ];
    }
    // No 'else' needed as default values are set initially

    return { nlp_parse, simulated_fhir_response };
}


// --- Main Home Component ---
export default function Home() {
    const { t } = useTranslation('common'); // Initialize useTranslation with the 'common' namespace
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<BackendResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [currentLocale, setCurrentLocale] = useState(i18n.language); // To track and display current language


    // Translate the suggestion keys first, then filter based on the translated text
    const translatedSuggestions = querySuggestionKeys.map(key => t(key));

    const filteredSuggestions = translatedSuggestions.filter(s =>
        s.toLowerCase().includes(query.toLowerCase())
    );

    // --- Function to handle form submission (sending query to backend) ---
    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault(); // Prevent default form submission behavior
        if (!query.trim()) return; // Don't submit empty queries

        setLoading(true); // Indicate loading state
        setError(null); // Clear any previous errors
        setShowSuggestions(false); // Hide suggestions when submitting

        try {
            // Use environment variable for the backend URL
            // Ensure NEXT_PUBLIC_BACKEND_URL is defined in your .env.local file
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://127.0.0.1:5000';
            const response = await fetch(`${backendUrl}/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                // Handle HTTP errors (e.g., 404, 500)
                // Use translated error message
                throw new Error(`${t('error_fetch_failed')} ${response.status}`);
            }

            const data: BackendResponse = await response.json();
            setResults(data); // Set the results received from the backend
        } catch (err: any) {
            setError(`${t('error_fetch_failed')} ${err.message}`); // Display fetch errors
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- Function to handle clicking on a suggestion ---
    const handleSuggestionClick = useCallback((suggestion: string) => {
        setQuery(suggestion);
        setShowSuggestions(false); // Hide suggestions after selection
        // Optionally, you could automatically submit the query here
        // handleSubmit(); // Uncomment if you want immediate submission
    }, []);

    // --- Effect to handle clicks outside the input/suggestions to close suggestions ---
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node) &&
                !(event.target as HTMLElement).closest('.suggestions-list')) {
                // If click is outside input and not on a suggestion, hide suggestions
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Function to change the language
    const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = e.target.value;
        i18n.changeLanguage(newLocale); // Change the i18n language
        setCurrentLocale(newLocale); // Update state to reflect change in UI
    };


    // --- Chart Data Preparation Functions ---

    // Prepares data for a Bar Chart visualizing patient age distribution
    const getAgeDistributionData = () => {
        if (!results || results.nlp_parse.resource_type !== "Patient") return null;

        const patients: Patient[] = results.simulated_fhir_response.entry
            .map(e => e.resource)
            .filter(r => r.resourceType === "Patient"); // Ensure we only process Patient resources

        const ageGroups: { [key: string]: number } = {
            "0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81+": 0
        };

        patients.forEach(p => {
            let ageGroupKey: string; // FIX: Extracted nested ternary into if/else if
            if (p.age <= 20) {
                ageGroupKey = "0-20";
            } else if (p.age <= 40) {
                ageGroupKey = "21-40";
            } else if (p.age <= 60) {
                ageGroupKey = "41-60";
            } else if (p.age <= 80) {
                ageGroupKey = "61-80";
            } else {
                ageGroupKey = "81+";
            }
            ageGroups[ageGroupKey] = (ageGroups[ageGroupKey] ?? 0) + 1;
        });

        return {
            labels: Object.keys(ageGroups),
            datasets: [
                {
                    label: t('table_header_name'), // Example: Using a translation key for chart label
                    data: Object.values(ageGroups),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };
    };

    // Prepares data for a Pie Chart visualizing condition distribution
    const getConditionDistributionData = () => {
        if (!results) return null;

        let conditions: string[] = [];
        if (results.nlp_parse.resource_type === "Patient") {
            const patients: Patient[] = results.simulated_fhir_response.entry
                .map(e => e.resource)
                .filter(r => r.resourceType === "Patient");
            patients.forEach(p => conditions = conditions.concat(p.conditions)); // Collect all conditions from patients
        } else if (results.nlp_parse.resource_type === "Condition") {
             const conditionResources = results.simulated_fhir_response.entry
                .map(e => e.resource)
                .filter(r => r.resourceType === "Condition");
            conditions = conditionResources.map(c => c.code.text); // Collect condition text from Condition resources
        }
        
        const conditionCounts: { [key: string]: number } = {};
        conditions.forEach(c => {
            conditionCounts[c] = (conditionCounts[c] ?? 0) + 1;
        });

        // Define a set of colors for the pie chart slices
        const backgroundColors = [
            'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)',
            'rgba(199, 199, 199, 0.6)', 'rgba(83, 102, 255, 0.6)'
        ];

        return {
            labels: Object.keys(conditionCounts),
            datasets: [
                {
                    label: t('condition_distribution'),
                    data: Object.values(conditionCounts),
                    backgroundColor: Object.keys(conditionCounts).map((_, i) => backgroundColors[i % backgroundColors.length]),
                    borderColor: Object.keys(conditionCounts).map((_, i) => backgroundColors[i % backgroundColors.length].replace('0.6', '1')),
                    borderWidth: 1,
                },
            ],
        };
    };

    const ageData = getAgeDistributionData();
    const conditionData = getConditionDistributionData();

    // --- Function to prepare data for the results table ---
    const getTableData = () => {
        if (!results) return [];

        if (results.nlp_parse.resource_type === "Patient") {
            // If the query was for patients, return patient details
            return results.simulated_fhir_response.entry
                .map(e => e.resource)
                .filter(r => r.resourceType === "Patient")
                .map((p: Patient): PatientTableData => ({
                    id: p.id,
                    name: p.name,
                    age: p.age,
                    gender: p.gender,
                    conditions: p.conditions.join(', ')
                }));
        } else if (results.nlp_parse.resource_type === "Condition") {
            // If the query was for conditions, return condition details with patient name
            return results.simulated_fhir_response.entry
                .map(e => e.resource)
                .filter(r => r.resourceType === "Condition")
                .map((c: any): ConditionTableData => ({
                    id: c.id,
                    patientName: c.subject?.display ?? 'N/A',
                    condition: c.code?.text ?? 'N/A'
                }));
        }
        return []; // Return empty array if no relevant data
    };

    const tableData = getTableData();

    // --- UI Structure (JSX) ---
    return (
        <main className="flex min-h-screen flex-col items-center p-24 bg-gray-100 text-gray-800">
            <h1 className="text-4xl font-bold mb-8 text-blue-700">{t('title')}</h1>

            {/* Language Selector */}
            <div className="mb-4 self-end">
                <label htmlFor="locale-select" className="mr-2 text-gray-700">{t('language')}:</label>
                <select id="locale-select" value={currentLocale} onChange={handleLocaleChange} className="p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                </select>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-8 relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full p-4 border border-blue-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    placeholder={t('placeholder_query')}
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg suggestions-list">
                        {filteredSuggestions.map((suggestion) => (
                            <button // FIX: Changed li to button
                                key={suggestion}
                                type="button" // Important for buttons not in a form
                                className="p-3 hover:bg-blue-100 cursor-pointer border-b border-gray-200 last:border-b-0 w-full text-left" // Added w-full text-left for styling
                                onClick={() => handleSuggestionClick(suggestion)}
                                // role, tabIndex, and onKeyDown are now handled natively by <button>
                            >
                                {/* Display the already translated suggestion */}
                                {suggestion}
                            </button>
                        ))}
                    </ul>
                )}
                <button
                    type="submit"
                    className="mt-4 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 text-lg"
                    disabled={loading}
                >
                    {loading ? t('processing_button') : t('submit_button')}
                </button>
            </form>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">{t('error_prefix')}</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {results && (
                <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-xl">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600">{t('results_title')}</h2>

                    {/* NLP Parse Info */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-md">
                        <h3 className="text-xl font-medium mb-2 text-blue-800">{t('nlp_analysis')}</h3>
                        <p><strong>{t('intent')}</strong> {results.nlp_parse.intent}</p>
                        <p><strong>{t('resource_type')}</strong> {results.nlp_parse.resource_type}</p>
                        <p><strong>{t('fhir_parameters')}</strong> {JSON.stringify(results.nlp_parse.fhir_params)}</p>
                        <p><strong>{t('simulated_fhir_request_url')}</strong> <code className="bg-gray-200 p-1 rounded text-sm">{results.nlp_parse.simulated_fhir_request_url}</code></p>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {ageData && results.nlp_parse.resource_type === "Patient" && (
                            <div className="bg-gray-50 p-4 rounded-md shadow-inner">
                                <h3 className="text-xl font-medium mb-2 text-blue-800">{t('patient_age_distribution')}</h3>
                                <Bar data={ageData} options={{ responsive: true, plugins: { title: { display: true, text: t('patient_age_distribution') } } }} />
                            </div>
                        )}
                        {conditionData && (
                            <div className="bg-gray-50 p-4 rounded-md shadow-inner">
                                <h3 className="text-xl font-medium mb-2 text-blue-800">{t('condition_distribution')}</h3>
                                <Pie data={conditionData} options={{ responsive: true, plugins: { title: { display: true, text: t('condition_distribution') } } }} />
                            </div>
                        )}
                    </div>

                    {/* Table Display */}
                    <div className="overflow-x-auto">
                        <h3 className="text-xl font-medium mb-2 text-blue-800">{t('detailed_results_table')}</h3>
                        {tableData.length > 0 ? (
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                                <thead>
                                    <tr className="bg-blue-100 text-left text-sm font-semibold text-gray-700">
                                        {results.nlp_parse.resource_type === "Patient" ? (
                                            <>
                                                <th className="py-3 px-4 border-b">{t('table_header_name')}</th>
                                                <th className="py-3 px-4 border-b">{t('table_header_age')}</th>
                                                <th className="py-3 px-4 border-b">{t('table_header_gender')}</th>
                                                <th className="py-3 px-4 border-b">{t('table_header_conditions')}</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="py-3 px-4 border-b">{t('table_header_patient_name')}</th>
                                                <th className="py-3 px-4 border-b">{t('table_header_condition')}</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((item: PatientTableData | ConditionTableData) => (
                                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            {results.nlp_parse.resource_type === "Patient" ? (
                                                <>
                                                    <td className="py-3 px-4">{(item as PatientTableData).name}</td>
                                                    <td className="py-3 px-4">{(item as PatientTableData).age}</td>
                                                    <td className="py-3 px-4">{(item as PatientTableData).gender}</td>
                                                    <td className="py-3 px-4">{(item as PatientTableData).conditions}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="py-3 px-4">{(item as ConditionTableData).patientName}</td>
                                                    <td className="py-3 px-4">{(item as ConditionTableData).condition}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-600">{t('no_results_found')}</p>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}