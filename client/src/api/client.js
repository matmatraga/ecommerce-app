const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const getToken = () => localStorage.getItem('token');

export async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.error || data.message || 'Request failed';
    throw new Error(message);
  }

  return data;
}

export default API_URL;
