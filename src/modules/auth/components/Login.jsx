import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado para controlar la visibilidad

  const navigate = useNavigate();
  const { login } = useAuth();
  const { state } = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      const redirectTo = state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.errors?.email?.[0] ||
        'Error al iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <> {/* Fragmento, ya que este componente no necesita su propio div contenedor */}
      <h1 className="text-3xl font-semibold text-white mb-8 text-center">
        Inicia Sesión
      </h1>
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
            Correo Electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-5 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-600 outline-none text-gray-900"
            placeholder=""
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
            Contraseña
          </label>
          {/* Contenedor relativo para posicionar el icono del ojo */}
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'password' : 'text'} 
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-600 outline-none text-gray-900 pr-10" // Añade padding a la derecha
              placeholder=""
              disabled={isLoading}
            />
            <button
              type="button" // Importante: type="button" para no enviar el formulario
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              disabled={isLoading}
            >
              {showPassword ? (
                // Ícono de ojo abierto
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              ) : (
                // Ícono de ojo cerrado
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.981 12H12M3.981 12a8.7 8.7 0 0 0 0 3.038M3.981 12a8.7 8.7 0 0 1 0-3.038v-2.1c0-.496.183-.984.512-1.353m-1.314 5.39c.237.45.54.845.895 1.189M12 12a8.962 8.962 0 0 1-2.909 6.64M12 12c-2.85 0-5.167-.79-7.091-2.274M12 12c3.275 0 6-3.75 6-7.5M12 12a8.962 8.962 0 0 0-2.909-6.64m-1.314 5.39a9.664 9.664 0 0 0-.584-1.22M12 12c.983-.346 1.902-.68 2.766-.994M12 12a9 9 0 0 1 3.821 1.1M12 12c1.91 0 3.472-1.45 4.521-2.923M12 12a9 9 0 0 0 3.821 1.1M12 12a9 9 0 0 1-.681 4.75m.144-.092a8.995 8.995 0 0 0-.173.34l-.454.912C14.73 17.65 16.142 19.5 18 19.5c1.858 0 3.27-1.85 4.073-4.04M20.246 12a8.7 8.7 0 0 1 0-3.038v-2.1c0-.496-.183-.984-.512-1.353M20.246 12a8.7 8.7 0 0 0 0 3.038"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg transition duration-300 ease-in-out ${
            isLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Iniciando...
            </div>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>
    </>
  );
}