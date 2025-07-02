import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../../api/apiClient';

export default function RoomDetail() {
  const [room, setRoom] = useState(null);
  const [museum, setMuseum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id : roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const museumId = location.state?.museumId;

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await apiClient.get(`/api/rooms/${roomId}`);
        
        setRoom(response.data);
        // Obtener información del museo si no se pasó en location.state
        if (!museumId && response.data.museum_id) {
          const museumResponse = await apiClient.get(`/api/museums/${response.data.museum_id}`);
          setMuseum(museumResponse.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching room:', err);
        setError('No se pudo cargar la sala. Por favor, intenta de nuevo.');
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId, museumId]);

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta sala?')) return;

    try {
      await apiClient.delete(`/api/rooms/${roomId}`);
      navigate(`/museums/${museumId || room.museum_id}`, {
        state: { successMessage: 'Sala eliminada exitosamente.' }
      });
    } catch (err) {
      console.error('Error deleting room:', err);
      setError('No se pudo eliminar la sala. Por favor, intenta de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 text-lg animate-pulse">Cargando sala...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 bg-red-100 p-4 rounded-md max-w-4xl m-auto">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-100 text-blue-700 hover:bg-blue-300 py-2 px-4 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="text-center text-red-600 bg-red-100 p-4 rounded-md max-w-4xl m-auto">
        Sala no encontrada.
      </div>
    );
  }

  return (
    <div className="max-w-4xl m-auto w-full bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{room.name || room.nombre}</h2>
        <div className="flex space-x-4">
          <Link
            to={`/museums/${museumId || room.museum_id}`}
            className="bg-indigo-100 text-indigo-700 hover:bg-indigo-300 py-2 px-4 rounded"
            aria-label="Volver al museo"
          >
            Volver
          </Link>
          <Link
            to={`/museums/${museumId || room.museum_id}/rooms/${roomId}/edit`}
            state={{ museumId: museumId || room.museum_id }}
            className="bg-blue-100 text-blue-700 hover:bg-blue-300 py-2 px-4 rounded"
            aria-label="Editar sala"
          >
            Editar Sala
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-100 text-red-700 hover:bg-red-300 py-2 px-4 rounded"
            aria-label="Eliminar sala"
          >
            Eliminar Sala
          </button>
        </div>
      </div>

      {museum && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-blue-100">
          <h3 className="text-sm font-medium text-purple-800">Museo asociado:</h3>
          <p className="text-lg font-semibold text-purple-900">{museum.name || museum.nombre}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img
            src={room.image || room.imagen || 'https://via.placeholder.com/300x200?text=Room'}
            alt={room.name || room.nombre}
            className="w-full h-64 object-cover rounded-md"
          />
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">ID:</span> {room.id}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Creado:</span>{' '}
            {new Date(room.created_at || room.creado).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Actualizado:</span>{' '}
            {new Date(room.updated_at || room.actualizado).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800">Descripción</h3>
        <p className="text-sm text-gray-600">{room.description || room.descripcion}</p>
      </div>
    </div>
  );
}