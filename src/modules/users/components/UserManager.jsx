import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../../api/apiClient';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingUser, setEditingUser] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  // Obtener usuarios
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/users');
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error al cargar los usuarios. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Crear nuevo usuario
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim() || !newUser.password_confirmation.trim()) {
      setCreateError('Todos los campos son obligatorios');
      return;
    }
    if (newUser.password !== newUser.password_confirmation) {
      setCreateError('Las contraseñas no coinciden');
      return;
    }

    try {
      setIsCreating(true);
      setCreateError(null);
      const response = await apiClient.post('/api/users', newUser);
      setUsers([...users, response.data.data]);
      setNewUser({ name: '', email: '', password: '', password_confirmation: '' });
      setSuccessMessage(`Usuario "${response.data.data.name}" creado exitosamente!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error creating user:', err);
      let errorMsg = 'Error al crear el usuario';
      if (err.response && err.response.data && err.response.data.message) {
        errorMsg = err.response.data.message;
      }
      if (err.response && err.response.status === 422 && err.response.data.errors) {
        errorMsg = Object.values(err.response.data.errors)[0]?.[0] || errorMsg;
      }
      setCreateError(errorMsg);
    } finally {
      setIsCreating(false);
    }
  };

  // Iniciar edición
  const startEditing = (user) => {
    setEditingId(user.id);
    setEditingUser({ name: user.name, email: user.email, password: '', password_confirmation: '' });
    setUpdateError(null);
  };

  // Cancelar edición
  const cancelEditing = () => {
    setEditingId(null);
    setEditingUser({ name: '', email: '', password: '', password_confirmation: '' });
    setUpdateError(null);
  };

  // Actualizar usuario
  const handleUpdateUser = async (id) => {
    if (!editingUser.name.trim() || !editingUser.email.trim()) {
      setUpdateError('El nombre y el correo electrónico son obligatorios');
      return;
    }
    if (editingUser.password && editingUser.password !== editingUser.password_confirmation) {
      setUpdateError('Las contraseñas no coinciden');
      return;
    }

    try {
      setIsUpdating(true);
      setUpdateError(null);
      const payload = { name: editingUser.name, email: editingUser.email };
      if (editingUser.password.trim()) {
        payload.password = editingUser.password;
        payload.password_confirmation = editingUser.password_confirmation;
      }
      const response = await apiClient.put(`/api/users/${id}`, payload);

      setUsers(users.map(user => 
        user.id === id ? response.data.data : user
      ));
      
      setSuccessMessage(`Usuario "${response.data.data.name}" actualizado exitosamente!`);
      setTimeout(() => setSuccessMessage(null), 3000);
      cancelEditing();
    } catch (err) {
      console.error('Error updating user:', err);
      let errorMsg = 'Error al actualizar el usuario';
      if (err.response && err.response.data && err.response.data.message) {
        errorMsg = err.response.data.message;
      }
      if (err.response && err.response.status === 422 && err.response.data.errors) {
        errorMsg = Object.values(err.response.data.errors)[0]?.[0] || errorMsg;
      }
      setUpdateError(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`¿Estás seguro que deseas eliminar el usuario "${name}"?`)) {
      return;
    }

    try {
      setIsDeleting(id);
      setError(null);
      await apiClient.delete(`/api/users/${id}`);
      
      setUsers(users.filter(user => user.id !== id));
      setSuccessMessage(`Usuario "${name}" eliminado exitosamente!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      let errorMsg = 'Error al eliminar el usuario';
      if (err.response && err.response.data && err.response.data.message) {
        errorMsg = err.response.data.message;
      }
      setError(errorMsg);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
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

      {/* Formulario para crear nuevo usuario */}
      <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Crear Nuevo Usuario</h2>
        <form onSubmit={handleCreateUser} className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="new-user-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              id="new-user-name"
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                createError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
              }`}
              placeholder="Ej: Juan Pérez"
              disabled={isCreating}
            />
          </div>
          <div>
            <label htmlFor="new-user-email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico *
            </label>
            <input
              id="new-user-email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                createError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
              }`}
              placeholder="Ej: juan@example.com"
              disabled={isCreating}
            />
          </div>
          <div>
            <label htmlFor="new-user-password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña *
            </label>
            <input
              id="new-user-password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                createError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
              }`}
              placeholder="Mínimo 8 caracteres"
              disabled={isCreating}
            />
          </div>
          <div>
            <label htmlFor="new-user-password-confirmation" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar contraseña *
            </label>
            <input
              id="new-user-password-confirmation"
              type="password"
              value={newUser.password_confirmation}
              onChange={(e) => setNewUser({ ...newUser, password_confirmation: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                createError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
              }`}
              placeholder="Repite la contraseña"
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
            {isCreating ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </div>
            ) : 'Crear'}
          </button>
        </form>
      </div>

      {/* Lista de usuarios */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Usuarios Existentes</h2>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error && !users.length ? (
          <div className="text-center py-10 text-red-600">
            {error}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No hay usuarios registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Correo</th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">{user.id}</td>
                    <td className="py-3 px-4">
                      {editingId === user.id ? (
                        <input
                          type="text"
                          value={editingUser.name}
                          onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                          className={`w-full px-3 py-1 border rounded-md focus:ring-2 focus:outline-none ${
                            updateError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                          }`}
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-gray-800">{user.name}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editingId === user.id ? (
                        <input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                          className={`w-full px-3 py-1 border rounded-md focus:ring-2 focus:outline-none ${
                            updateError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                          }`}
                        />
                      ) : (
                        <span className="text-gray-600">{user.email}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {editingId === user.id ? (
                        <div className="flex justify-end space-x-2">
                          <div className="flex-grow">
                            <label htmlFor={`edit-user-password-${user.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                              Nueva contraseña (opcional)
                            </label>
                            <input
                              id={`edit-user-password-${user.id}`}
                              type="password"
                              value={editingUser.password}
                              onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                              className={`w-full px-3 py-1 border rounded-md focus:ring-2 focus:outline-none ${
                                updateError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                              }`}
                              placeholder="Dejar en blanco para no cambiar"
                            />
                            <label htmlFor={`edit-user-password-confirmation-${user.id}`} className="block text-sm font-medium text-gray-700 mt-2 mb-1">
                              Confirmar nueva contraseña
                            </label>
                            <input
                              id={`edit-user-password-confirmation-${user.id}`}
                              type="password"
                              value={editingUser.password_confirmation}
                              onChange={(e) => setEditingUser({ ...editingUser, password_confirmation: e.target.value })}
                              className={`w-full px-3 py-1 border rounded-md focus:ring-2 focus:outline-none ${
                                updateError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                              }`}
                              placeholder="Repite la contraseña"
                            />
                            {updateError && <p className="mt-1 text-sm text-red-600">{updateError}</p>}
                          </div>
                          <button
                            onClick={() => handleUpdateUser(user.id)}
                            disabled={isUpdating}
                            className={`px-3 py-1 text-white rounded-md text-sm ${
                              isUpdating
                                ? 'bg-green-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {isUpdating ? (
                              <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Guardando...
                              </div>
                            ) : 'Guardar'}
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
                            onClick={() => startEditing(user)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            disabled={isDeleting === user.id}
                            className={`px-3 py-1 text-white rounded-md text-sm ${
                              isDeleting === user.id
                                ? 'bg-red-400 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700'
                            }`}
                          >
                            {isDeleting === user.id ? (
                              <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Eliminando...
                              </div>
                            ) : 'Eliminar'}
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
        <h3 className="text-sm font-medium text-gray-700 mb-2">Sobre los usuarios</h3>
        <p className="text-sm text-gray-600">
          Los usuarios pueden acceder al sistema con diferentes roles. Solo los administradores pueden crear, editar o eliminar usuarios.
        </p>
      </div>
    </div>
  );
}