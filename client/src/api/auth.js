import { apiRequest } from './client';

export const register = (body) =>
  apiRequest('/users/register', { method: 'POST', body: JSON.stringify(body) });

export const login = (body) =>
  apiRequest('/users/login', { method: 'POST', body: JSON.stringify(body) });

export const logout = () => apiRequest('/users/logout', { method: 'POST' });

export const getUserDetails = () => apiRequest('/users/details');
