import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const searchRoutes = async (origin, destination, preferences = {}) => {
  const response = await api.post('/search', {
    origin: {
      type: 'zone',
      value: origin
    },
    destination: {
      type: 'landmark',
      value: destination
    },
    preferences
  });
  return response.data;
};

export default api;
