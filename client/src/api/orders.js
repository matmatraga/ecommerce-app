import { apiRequest } from './client';

export const createOrder = (body) =>
  apiRequest('/orders', { method: 'POST', body: JSON.stringify(body) });

export const getMyOrders = () => apiRequest('/orders/authenticatedorder');

export const getAllOrders = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v != null)
  );
  const query = new URLSearchParams(clean).toString();
  return apiRequest(`/orders/allorders${query ? `?${query}` : ''}`);
};

export const updateOrderStatus = (orderId, status) =>
  apiRequest(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

export const cancelOrder = (orderId) =>
  apiRequest(`/orders/${orderId}/cancel`, { method: 'PATCH' });
