// A robust wrapper around native fetch for the FastAPI backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export class APIError extends Error {
  status: number;
  data?: Record<string, unknown>;

  constructor(status: number, message: string, data?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'APIError';
  }
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // In a real app, retrieve JWT from cookies or a secure store
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: response.statusText };
    }
    // Handle RFC 7807 standard error structure
    const message = errorData.detail || errorData.title || 'An error occurred';
    throw new APIError(response.status, message, errorData);
  }

  return response;
}

export const api = {
  get: (endpoint: string, options?: RequestInit) => fetchWithAuth(endpoint, { ...options, method: 'GET' }).then(res => res.json()),
  post: (endpoint: string, data: Record<string, unknown>, options?: RequestInit) => fetchWithAuth(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }).then(res => res.json()),
  put: (endpoint: string, data: Record<string, unknown>, options?: RequestInit) => fetchWithAuth(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }).then(res => res.json()),
  delete: (endpoint: string, options?: RequestInit) => fetchWithAuth(endpoint, { ...options, method: 'DELETE' }).then(res => res.json()),
};
