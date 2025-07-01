import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Añadir useNavigate
import apiClient from '../../../api/apiClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Estado para manejar errores
  const navigate = useNavigate(); // Hook para redirección

  const handleSubmit = async (e) => { // Hacer la función asíncrona
    e.preventDefault();
    setError(''); // Resetear errores

    const data = {
      email: email,
      password: password
    };
    
    try {
      // Hacer la petición POST y esperar la respuesta
      const response = await apiClient.post('/api/login', data);
      
      
      // Extraer el token de la respuesta
      const token = response.data.access_token;
      
      if (token) {
        // Almacenar el token en localStorage
        localStorage.setItem('authToken', token);
        
        // Redirigir al usuario (por ejemplo a la página de inicio)
        navigate('/');
      } else {
        setError('No se recibió token en la respuesta');
      }
      
    } catch (err) {
      // Manejar errores de la petición
      console.error('Error en login:', err);
      setError('Credenciales incorrectas o error en el servidor');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-600 text-sm text-center">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Correo Electrónico
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="tu@correo.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Iniciar Sesión
      </button>
    </form>
  );
}