import axios from 'axios';

// Create an Axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // important for sending cookies
});

// Request interceptor to automatically add the token, if preferred over purely cookie-based approach
api.interceptors.request.use(
  (config) => {
    // We'll rely on HttpOnly cookies mostly, but we could add an Authorization header if needed
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
