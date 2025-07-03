import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Bienvenido a Chamus
      </h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        Administra los museos, sus categorías y usuarios de manera eficiente con nuestro sistema.
      </p>

      <div className="grid grid-cols-1  gap-4">
        <Link
          to="/categories"
          className="bg-blue-50 p-6 rounded-xl border border-blue-100 hover:bg-blue-100 transition text-center"
        >
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Gestión de Categorías</h2>
          <p className="text-gray-600">
            Organiza los museos por categorías, como Arte Moderno, Historia Natural o Tecnología.
          </p>
        </Link>
        <Link
          to="/users"
          className="bg-green-50 p-6 rounded-xl border border-green-100 hover:bg-green-100 transition text-center"
        >
          <h2 className="text-xl font-semibold text-green-800 mb-2">Gestión de Usuarios</h2>
          <p className="text-gray-600">
            Crea, edita o elimina cuentas de usuarios para controlar el acceso al sistema.
          </p>
        </Link>

        <Link
          to="/museums"
          className="bg-red-50 p-6 rounded-xl border border-red-100 hover:bg-red-100 transition text-center"
        >
          <h2 className="text-xl font-semibold text-red-800 mb-2">Gestión de Museos</h2>
          <p className="text-gray-600">
            Crea, edita o elimina museos en el sistema, aqui tambien se gestionan las salas y los descuentos.
          </p>
        </Link>
      </div>

      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Sobre Chamus</h3>
        <p className="text-sm text-gray-600">
          Chamus es un sistema diseñado para facilitar la gestión de museos, permitiendo organizar colecciones y administrar usuarios de forma sencilla y segura.
        </p>
      </div>
    </div>
  );
}