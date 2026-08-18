// Centralized typed API client for VentureLens AI

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

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

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData: Record<string, unknown> = {};
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: response.statusText };
    }
    const message = (errorData.detail as string) || (errorData.title as string) || `Request failed with status ${response.status}`;
    throw new APIError(response.status, message, errorData);
  }

  return response;
}

export const api = {
  get: async <T = any>(endpoint: string, options?: RequestInit): Promise<T> => {
    const res = await fetchWithAuth(endpoint, { ...options, method: 'GET' });
    return res.json();
  },
  post: async <T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<T> => {
    const body = data instanceof FormData ? data : JSON.stringify(data ?? {});
    const res = await fetchWithAuth(endpoint, { ...options, method: 'POST', body });
    return res.json();
  },
  patch: async <T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<T> => {
    const body = data instanceof FormData ? data : JSON.stringify(data ?? {});
    const res = await fetchWithAuth(endpoint, { ...options, method: 'PATCH', body });
    return res.json();
  },
  put: async <T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<T> => {
    const body = data instanceof FormData ? data : JSON.stringify(data ?? {});
    const res = await fetchWithAuth(endpoint, { ...options, method: 'PUT', body });
    return res.json();
  },
  delete: async <T = any>(endpoint: string, options?: RequestInit): Promise<T> => {
    const res = await fetchWithAuth(endpoint, { ...options, method: 'DELETE' });
    if (res.status === 204) return {} as T;
    return res.json();
  },
};
