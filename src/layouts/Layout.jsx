import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate('/auth/login');
    } catch (err) {
      alert('Error al cerrar sesión. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        className={`${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'
          } bg-purple-800 text-white fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out lg:static lg:w-64 lg:translate-x-0 flex-shrink-0 overflow-y-auto`}
      >
        <div className="p-4">
          <div className="flex items-center justify-center mb-20">
            <Link to="/">
              <img src="/img/logo.png" alt="logo" className="h-12" />
            </Link>
          </div>
          <nav className="space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-purple-700 ${isActive ? 'bg-purple-900' : ''}`
              }
            >
              Inicio
            </NavLink>
            <NavLink
              to="/museums"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-purple-700 ${isActive ? 'bg-purple-900' : ''}`
              }
            >
              Museos
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-purple-700 ${isActive ? 'bg-purple-900' : ''}`
              }
            >
              Categorías
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-purple-700 ${isActive ? 'bg-purple-900' : ''}`
              }
            >
              Usuarios
            </NavLink>
            <button
              onClick={handleLogout}
              className="block w-full text-left py-2 px-4 rounded hover:bg-purple-700 bg-purple-800 text-white"
            >
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </aside>

      <button
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-purple-600 text-white rounded-md"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? 'Cerrar' : 'Menú'}
      </button>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Chamus Dashboard</h1>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;