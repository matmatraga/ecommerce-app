// Empty by default so requests are same-origin and the Vite dev proxy (or a
// same-domain deployment) forwards them with the httpOnly auth cookie attached.
const API_URL = import.meta.env.VITE_API_URL || '';

export async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
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
