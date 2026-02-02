import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Production API
export const productionAPI = {
  getAll: () => api.get('/production'),
  getByDate: (date) => api.get(`/production/date/${date}`),
  create: (data) => api.post('/production', data),
  update: (id, data) => api.put(`/production/${id}`, data),
  delete: (id) => api.delete(`/production/${id}`),
};

// Pricing API
export const pricingAPI = {
  getAll: () => api.get('/pricing'),
  getBySize: (size) => api.get(`/pricing/${size}`),
  createOrUpdate: (data) => api.post('/pricing', data),
  update: (size, data) => api.put(`/pricing/${size}`, data),
  initialize: () => api.post('/pricing/initialize'),
};

// Sales API
export const salesAPI = {
  getAll: () => api.get('/sales'),
  getByDate: (date) => api.get(`/sales/date/${date}`),
  getByRange: (startDate, endDate) => api.get(`/sales/range?startDate=${startDate}&endDate=${endDate}`),
  create: (data) => api.post('/sales', data),
  getById: (id) => api.get(`/sales/${id}`),
  delete: (id) => api.delete(`/sales/${id}`),
};

// Inventory API
export const inventoryAPI = {
  getAll: () => api.get('/inventory'),
  getCurrent: () => api.get('/inventory/current'),
  getByDate: (date) => api.get(`/inventory/date/${date}`),
  delete: (id) => api.delete(`/inventory/${id}`),
};

// Reports API
export const reportsAPI = {
  getProductionReport: (date) => api.get(`/reports/production/${date}`),
  getSalesReport: (date) => api.get(`/reports/sales/${date}`),
  getInventoryReport: (date) => api.get(`/reports/inventory/${date}`),
  getDashboard: () => api.get('/reports/dashboard'),
};

// Users API
export const usersAPI = {
  login: (data) => api.post('/users/login', data),
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  changePassword: (id, data) => api.put(`/users/${id}/password`, data),
  toggleStatus: (id) => api.put(`/users/${id}/toggle-status`),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;
