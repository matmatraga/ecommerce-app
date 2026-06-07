import API_URL, { getToken } from './client';

export async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const token = getToken();
  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Upload failed');
  }
  return data;
}
