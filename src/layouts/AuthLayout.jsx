import React from 'react';
import { Outlet } from 'react-router-dom';
import logo from '../../public/img/logo.png'; // Ajusta esta ruta según la ubicación de tu logo

function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-violet-600 to-indigo-600" > {/* Fondo púrpura */}
      <div className="flex w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden"> {/* Contenedor principal con sombra y bordes redondeados */}
        {/* Columna Izquierda: Logo */}
        <div className="w-1/2 bg-black flex items-center justify-center p-8"> {/* Fondo negro para el logo */}
          <img src={logo} alt="Chamus Logo" className="w-50 " />
        </div>

        {/* Columna Derecha: Contenido del formulario (Outlet) */}
        <div className="w-1/2 p-10 flex flex-col justify-center bg-gradient-to-r from-violet-600 to-indigo-600" > {/* Fondo púrpura claro */}
          {/* El Outlet renderizará los componentes hijos, como el Login */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;