import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../../api/apiClient';

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // Obtener categorías
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/categories');
      setCategories(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Error al cargar las categorías. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Crear nueva categoría
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      setCreateError('El nombre de la categoría no puede estar vacío');
      return;
    }

    try {
      setIsCreating(true);
      setCreateError(null);
      const response = await apiClient.post('/api/categories', {
        name: newCategory
      });
      setCategories([...categories, response.data]);
      setNewCategory('');
      setSuccessMessage(`Categoría "${response.data.nombre}" creada exitosamente!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      let errorMsg = 'Error al crear la categoría';
      if (err.response && err.response.data && err.response.data.message) {
        errorMsg = err.response.data.message;
      }
      setCreateError(errorMsg);
    } finally {
      setIsCreating(false);
    }
  };

  // Iniciar edición
  const startEditing = (category) => {
    setEditingId(category.id);
    setEditingName(category.nombre);
  };

  // Cancelar edición
  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  // Actualizar categoría
  const handleUpdateCategory = async (id) => {
    if (!editingName.trim()) {
      setError('El nombre de la categoría no puede estar vacío');
      return;
    }

    try {
      const response = await apiClient.put(`/api/categories/${id}`, {
        name: editingName
      });

      setCategories(categories.map(cat => 
        cat.id === id ? response.data : cat
      ));
      
      setSuccessMessage(`Categoría actualizada a "${response.data.nombre}"!`);
      setTimeout(() => setSuccessMessage(null), 3000);
      cancelEditing();
    } catch (err) {
      console.error('Error updating category:', err);
      
      let errorMsg = 'Error al actualizar la categoría';
      if (err.response && err.response.data && err.response.data.message) {
        errorMsg = err.response.data.message;
      }
      setError(errorMsg);
    }
  };

  // Eliminar categoría
  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`¿Estás seguro que deseas eliminar la categoría "${name}"?`)) {
      return;
    }

    try {
      await apiClient.delete(`/api/categories/${id}`);
      
      setCategories(categories.filter(cat => cat.id !== id));
      setSuccessMessage(`Categoría "${name}" eliminada exitosamente!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting category:', err);
      
      let errorMsg = 'Error al eliminar la categoría';
      if (err.response && err.response.data && err.response.data.message) {
        errorMsg = err.response.data.message;
      }
      setError(errorMsg);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Categorías</h1>
        <Link 
          to="/"
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 px-4 rounded-md transition"
        >
          Volver al inicio
        </Link>
      </div>

      {/* Mensajes de estado */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
          <p className="font-medium">Éxito:</p>
          <p>{successMessage}</p>
        </div>
      )}

      {/* Formulario para crear nueva categoría */}
      <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Crear Nueva Categoría</h2>
        <form onSubmit={handleCreateCategory} className="flex items-end gap-3">
          <div className="flex-grow">
            <label htmlFor="new-category" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la categoría *
            </label>
            <input
              id="new-category"
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                createError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
              }`}
              placeholder="Ej: Arte Moderno"
              disabled={isCreating}
            />
            {createError && <p className="mt-1 text-sm text-red-600">{createError}</p>}
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className={`py-2 px-6 rounded-lg text-white font-medium transition ${
              isCreating 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isCreating ? 'Creando...' : 'Crear'}
          </button>
        </form>
      </div>

      {/* Lista de categorías */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Categorías Existentes</h2>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600">
            {error}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No hay categorías registradas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">{category.id}</td>
                    <td className="py-3 px-4">
                      {editingId === category.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="w-full px-3 py-1 border border-gray-300 rounded-md"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-gray-800">{category.nombre}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {editingId === category.id ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleUpdateCategory(category.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => startEditing(category)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id, category.nombre)}
                            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Sobre las categorías</h3>
        <p className="text-sm text-gray-600">
          Las categorías te permiten organizar y clasificar tus museos y salas. 
          Puedes asignar categorías a museos para facilitar su búsqueda y filtrado.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Ejemplos de categorías: Arte Moderno, Historia Natural, Ciencia y Tecnología, 
          Arqueología, Arte Contemporáneo, etc.
        </p>
      </div>
    </div>
  );
}