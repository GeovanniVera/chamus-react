import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'
          } bg-indigo-800 text-white fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out lg:static lg:w-64 lg:translate-x-0 flex-shrink-0 overflow-y-auto`}
      >
        <div className="p-4">
          {/* <h2 className="text-2xl font-bold mb-6">Chamus</h2> */}
          <div className="flex items-center justify-center">
            <Link
              to={'/'}
            >
              <img src="/img/logo.png" alt="logo" className='w-30 h-30' />

            </Link>
          </div>
          <nav className="space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-indigo-700 ${isActive ? 'bg-indigo-900' : ''
                }`
              }
            >
              Inicio
            </NavLink>
            <NavLink
              to="/museums"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-indigo-700 ${isActive ? 'bg-indigo-900' : ''
                }`
              }
            >
              Museos
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-indigo-700 ${isActive ? 'bg-indigo-900' : ''
                }`
              }
            >
              Categorias
            </NavLink>
            {/* <NavLink
              to="/posts"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-indigo-700 ${
                  isActive ? 'bg-indigo-900' : ''
                }`
              }
            >
              Posts
            </NavLink> */}
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-indigo-700 ${isActive ? 'bg-indigo-900' : ''
                }`
              }
            >
              Usuarios
            </NavLink>
            <NavLink
              to="/auth/login"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-indigo-700 ${isActive ? 'bg-indigo-900' : ''
                }`
              }
            >
              Cerrar Sesion
            </NavLink>
          </nav>
        </div>
      </aside>

      {/* Botón para togglear el sidebar en móviles */}
      <button
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-indigo-600 text-white rounded-md"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? 'Cerrar' : 'Menú'}
      </button>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Mi Dashboard</h1>

        </header>

        {/* Área de contenido */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;