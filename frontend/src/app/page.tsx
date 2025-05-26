"use client"; // This is crucial for client-side functionality like state and effects

import { useState, useRef, useEffect, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components. This is essential for the charts to render correctly.
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// --- Interface Definitions for Data Structure ---
// THESE ARE THE ONES THAT NEED TO BE AT THE TOP LEVEL OF YOUR FILE
interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    conditions: string[];
}

interface FHIRResponse {
    resourceType: string;
    entry: { resource: any }[]; // 'any' because resource type can be Patient or Condition
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

// NEW INTERFACES FOR TABLE DATA - ADDED HERE
interface PatientTableData {
    name: string;
    age: number;
    gender: string;
    conditions: string; // conditions is joined as string
}

interface ConditionTableData {
    patientName: string;
    condition: string;
}
// END OF NEW INTERFACES

// --- Example Query Suggestions for Auto-complete ---
const querySuggestions = [
    "Show me all diabetic patients over 50",
    "Patients over 60 with hypertension",
    "Female patients with asthma",
    "What conditions does Alice Smith have?",
    "Patients over 70",
    "Male patients",
    "All patients"
];

// --- Main Home Component ---
export default function Home() {
    // State variables to manage UI and data
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<BackendResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false); // State to control suggestion visibility
    const inputRef = useRef<HTMLInputElement>(null); // Ref for input field to help with click-outside logic

    // Filter suggestions based on current query input for auto-complete
    const filteredSuggestions = querySuggestions.filter(s =>
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
            // Make POST request to your Flask backend.
            // Ensure your backend is running on http://127.0.0.1:5000/
            const response = await fetch('http://127.0.0.1:5000/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                // Handle HTTP errors (e.g., 404, 500)
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: BackendResponse = await response.json();
            setResults(data); // Set the results received from the backend
        } catch (err: any) {
            setError(`Failed to fetch data: ${err.message}`); // Display fetch errors
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false); // End loading state
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
            if (p.age <= 20) ageGroups["0-20"]++;
            else if (p.age <= 40) ageGroups["21-40"]++;
            else if (p.age <= 60) ageGroups["41-60"]++;
            else if (p.age <= 80) ageGroups["61-80"]++;
            else ageGroups["81+"]++;
        });

        return {
            labels: Object.keys(ageGroups),
            datasets: [
                {
                    label: 'Number of Patients',
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
            conditionCounts[c] = (conditionCounts[c] || 0) + 1; // Count occurrences of each condition
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
                    label: 'Condition Distribution',
                    data: Object.values(conditionCounts),
                    backgroundColor: Object.keys(conditionCounts).map((_, i) => backgroundColors[i % backgroundColors.length]),
                    borderColor: Object.keys(conditionCounts).map((_, i) => backgroundColors[i % backgroundColors.length].replace('0.6', '1')),
                    borderWidth: 1,
                },
            ],
        };
    };

    // --- Function to prepare data for the results table ---
    const getTableData = () => {
        if (!results) return [];

        if (results.nlp_parse.resource_type === "Patient") {
            // If the query was for patients, return patient details
            return results.simulated_fhir_response.entry
                .map(e => e.resource)
                .filter(r => r.resourceType === "Patient")
                .map((p: Patient): PatientTableData => ({ // Explicitly type 'p' as Patient and return type as PatientTableData
                    name: p.name,
                    age: p.age,
                    gender: p.gender,
                    conditions: p.conditions.join(', ') // Join conditions into a single string
                }));
        } else if (results.nlp_parse.resource_type === "Condition") {
            // If the query was for conditions, return condition details with patient name
            return results.simulated_fhir_response.entry
                .map(e => e.resource)
                .filter(r => r.resourceType === "Condition")
                .map((c: any): ConditionTableData => ({ // Explicitly type 'c' and return type as ConditionTableData
                    patientName: c.subject?.display || 'N/A', // Assuming 'subject.display' holds patient name
                    condition: c.code?.text || 'N/A' // Assuming 'code.text' holds condition name
                }));
        }
        return []; // Return empty array if no relevant data
    };

    const ageData = getAgeDistributionData();
    const conditionData = getConditionDistributionData();
    const tableData = getTableData();

    // --- UI Structure (JSX) ---
    return (
        <main className="flex min-h-screen flex-col items-center p-24 bg-gray-100 text-gray-800">
            <h1 className="text-4xl font-bold mb-8 text-blue-700">AI on FHIR Query Tool</h1>

            {/* Query Input Form with Auto-complete/Suggestions */}
            <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-8 relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true); // Show suggestions as user types
                    }}
                    onFocus={() => setShowSuggestions(true)} // Show suggestions when input is focused
                    className="w-full p-4 border border-blue-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    placeholder="e.g., Show me all diabetic patients over 50"
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg suggestions-list">
                        {filteredSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className="p-3 hover:bg-blue-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
                <button
                    type="submit"
                    className="mt-4 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 text-lg"
                    disabled={loading} // Disable button when loading
                >
                    {loading ? 'Processing...' : 'Query FHIR Data'}
                </button>
            </form>

            {/* Error Display */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {/* Results Display Area */}
            {results && (
                <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-xl">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600">Query Results</h2>

                    {/* NLP Parse Info (for debugging/understanding) */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-md">
                        <h3 className="text-xl font-medium mb-2 text-blue-800">NLP Analysis:</h3>
                        <p><strong>Intent:</strong> {results.nlp_parse.intent}</p>
                        <p><strong>Resource Type:</strong> {results.nlp_parse.resource_type}</p>
                        <p><strong>FHIR Parameters:</strong> {JSON.stringify(results.nlp_parse.fhir_params)}</p>
                        <p><strong>Simulated FHIR Request URL:</strong> <code className="bg-gray-200 p-1 rounded text-sm">{results.nlp_parse.simulated_fhir_request_url}</code></p>
                    </div>

                    {/* Charts Display */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Show Age Distribution only if the query was for Patient resources */}
                        {ageData && results.nlp_parse.resource_type === "Patient" && (
                            <div className="bg-gray-50 p-4 rounded-md shadow-inner">
                                <h3 className="text-xl font-medium mb-2 text-blue-800">Patient Age Distribution</h3>
                                <Bar data={ageData} options={{ responsive: true, plugins: { title: { display: true, text: 'Patient Age Distribution' } } }} />
                            </div>
                        )}
                        {/* Show Condition Distribution for both Patient and Condition queries */}
                        {conditionData && (
                            <div className="bg-gray-50 p-4 rounded-md shadow-inner">
                                <h3 className="text-xl font-medium mb-2 text-blue-800">Condition Distribution</h3>
                                <Pie data={conditionData} options={{ responsive: true, plugins: { title: { display: true, text: 'Condition Distribution' } } }} />
                            </div>
                        )}
                    </div>

                    {/* Table Display */}
                    <div className="overflow-x-auto">
                        <h3 className="text-xl font-medium mb-2 text-blue-800">Detailed Results Table:</h3>
                        {tableData.length > 0 ? (
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                                <thead>
                                    <tr className="bg-blue-100 text-left text-sm font-semibold text-gray-700">
                                        {results.nlp_parse.resource_type === "Patient" ? (
                                            <>
                                                <th className="py-3 px-4 border-b">Name</th>
                                                <th className="py-3 px-4 border-b">Age</th>
                                                <th className="py-3 px-4 border-b">Gender</th>
                                                <th className="py-3 px-4 border-b">Conditions</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="py-3 px-4 border-b">Patient Name</th>
                                                <th className="py-3 px-4 border-b">Condition</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Cast item to its expected type within the map function */}
                                    {tableData.map((item: PatientTableData | ConditionTableData, index: number) => (
                                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
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
                            <p className="text-gray-600">No results found for your query.</p>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}