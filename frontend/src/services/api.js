import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Camping Authorization API
export const campingAuthAPI = {
  create: (data) => api.post('/camping-authorizations', data),
  getById: (id) => api.get(`/camping-authorizations/${id}`),
  getPending: (limit, offset) => api.get(`/camping-authorizations/pending?limit=${limit}&offset=${offset}`),
  getMyRequests: () => api.get('/camping-authorizations/my/requests'),
  approve: (id, notes) => api.post(`/camping-authorizations/${id}/approve`, { additional_notes: notes }),
  reject: (id, reason, notes) => api.post(`/camping-authorizations/${id}/reject`, {
    rejection_reason: reason,
    additional_notes: notes
  })
};

// Notifications API
export const notificationAPI = {
  getAll: (limit, offset) => api.get(`/notifications?limit=${limit}&offset=${offset}`),
  getUnreadCount: () => api.get('/notifications/unread/count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all')
};

// Socket.IO Connection
export const connectSocket = (userId) => {
  const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001');
  
  socket.on('connect', () => {
    console.log('Socket connected');
    socket.emit('join-room', userId);
  });
  
  return socket;
};

export default api;
