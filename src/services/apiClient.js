/**
 * API Client abstraction for EcoWatch AI.
 * Currently serves data from local state/localStorage with simulated network latency,
 * structured for drop-in proxying to FastAPI backend (e.g., http://localhost:8000/api/v1).
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const USE_MOCK = true; // Toggle to false when FastAPI backend is live

export async function request(endpoint, options = {}) {
  if (USE_MOCK) {
    // Simulate natural network roundtrip
    await new Promise((resolve) => setTimeout(resolve, 200));
    return null;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

