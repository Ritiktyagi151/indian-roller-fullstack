import axios from 'axios';

const api = axios.create({
  // Ye environment variable se API ka base URL uthayega
  // Agar env file nahi mili toh default localhost:5000 use karega
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (Future mein agar Token/Auth add karna ho)
api.interceptors.request.use(
  (config) => {
    // Yahan tu JWT token add kar sakta hai
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;