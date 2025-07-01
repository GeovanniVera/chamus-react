import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://chamus.restteach.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept' : 'application/json'
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      // Si el token existe, lo añadimos al header Authorization
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
    // Manejar errores de autenticación (401, 403)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Aquí puedes manejar la lógica de redirección a login
      console.error('Error de autenticación - Redirigiendo a login');
      localStorage.removeItem('authToken'); // Eliminar token inválido
    }
    return Promise.reject(error);
  }
);


export default apiClient;