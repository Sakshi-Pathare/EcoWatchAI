const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');
const API_ORIGIN = /^https?:\/\//i.test(API_BASE_URL) ? new URL(API_BASE_URL).origin : '';
const AUTH_TOKEN_KEY = 'ecowatch_access_token_v1';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getAuthToken() {
  return typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token) {
  if (typeof sessionStorage === 'undefined') return;
  if (token) sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  else sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

function resolveAssetUrls(value) {
  if (Array.isArray(value)) return value.map(resolveAssetUrls);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolveAssetUrls(item)])
    );
  }
  if (API_ORIGIN && typeof value === 'string' && value.startsWith('/static/uploads/')) {
    return new URL(value, API_ORIGIN).toString();
  }
  return value;
}

export async function request(endpoint, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getAuthToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (options.body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = typeof errorData.detail === 'string'
      ? errorData.detail
      : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return null;
  return resolveAssetUrls(await response.json());
}

