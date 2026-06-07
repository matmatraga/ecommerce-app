import { apiRequest } from './client';

export const getActiveProducts = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/products${query ? `?${query}` : ''}`);
};

export const getAllProducts = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/products/all${query ? `?${query}` : ''}`);
};

export const getProduct = (id) => apiRequest(`/products/${id}`);

export const createProduct = (body) =>
  apiRequest('/products', { method: 'POST', body: JSON.stringify(body) });

export const updateProduct = (id, body) =>
  apiRequest(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(body) });

export const archiveProduct = (id) =>
  apiRequest(`/products/${id}/archive`, { method: 'PATCH' });

export const unarchiveProduct = (id) =>
  apiRequest(`/products/${id}/unarchive`, { method: 'PATCH' });

export const deleteProduct = (id) =>
  apiRequest(`/products/${id}`, { method: 'DELETE' });

export const searchByName = (name) =>
  apiRequest(`/products/search/name?name=${encodeURIComponent(name)}`);

export const searchByPrice = (minPrice, maxPrice) => {
  const params = new URLSearchParams();
  if (minPrice) params.set('minPrice', minPrice);
  if (maxPrice) params.set('maxPrice', maxPrice);
  return apiRequest(`/products/search/price?${params}`);
};

export const addReview = (id, body) =>
  apiRequest(`/products/${id}/reviews`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
