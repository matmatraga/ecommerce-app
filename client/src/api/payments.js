import { apiRequest } from './client';

export const createCheckoutSession = (orderId) =>
  apiRequest('/payments/checkout', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  });
