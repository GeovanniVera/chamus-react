import axios from 'axios';

const PRODUCCION_URL = "https://chamus.restteach.com"
const LOCAL_URL = "http://localhost:8000"


const apiClient = axios.create({
  baseURL: LOCAL_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept' : 'application/json'
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('AUTH_TOKEN');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('Error de autenticación - Redirigiendo a login');
      localStorage.removeItem('authToken'); 
    }
    return Promise.reject(error);
  }
);


export default apiClient;