import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Appointments
export const getAppointments = () => api.get('/appointments');
export const getAppointment = (id) => api.get(`/appointments/${id}`);
export const createAppointment = (data) => api.post('/appointments', data);

// Reschedules
export const getReschedules = () => api.get('/reschedules');
export const getReschedule = (id) => api.get(`/reschedules/${id}`);
export const createReschedule = (data) => api.post('/reschedules', data);
export const updateReschedule = (id, data) => api.put(`/reschedules/${id}`, data);
export const deleteReschedule = (id) => api.delete(`/reschedules/${id}`);

export default api;
