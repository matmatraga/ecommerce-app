import { apiRequest } from './client';

export const getCart = () => apiRequest('/carts');

export const addToCart = (body) =>
  apiRequest('/carts', { method: 'POST', body: JSON.stringify(body) });

export const updateQuantities = (products) =>
  apiRequest('/carts/quantity', {
    method: 'PUT',
    body: JSON.stringify({ products }),
  });

export const clearCart = () =>
  apiRequest('/carts/clear', { method: 'PATCH' });
