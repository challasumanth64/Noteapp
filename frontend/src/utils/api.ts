import axios from 'axios';

// Use the environment variable for the base URL.
// During development, it will be 'http://localhost:5000'.
// In production, you will set this to your live backend URL.
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;