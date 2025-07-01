import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'; // Añadir useLocation
import apiClient from '../../../api/apiClient';

export default function RoomDetail() {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: roomId } = useParams(); // Cambiar a solo id (renombrado a roomId)
  const navigate = useNavigate();
  const location = useLocation(); // Para acceder al estado de navegación

  // Obtener museumId del estado de navegación (si existe)
  const museumId = location.state?.museumId;

  useEffect(() => {
    // Datos estáticos como respaldo
    const staticRoom = {
      id: 1,
      nombre: 'Sala Siqueiros (Planta Baja)',
      imagen: 'https://chamus.restteach.com//storage/rooms/7xpKvkKYqPauIe6PpWjCXeat89Q5DnUDwd9gQOAm.png',
      descripcion: 'Introducción a la historia de México, desde Dos continentes aislados (época prehispánica y el primer contacto con los europeos) hasta El reino de Nueva España y la Guerra de Independencia. Incluye murales importantes.',
      creado: '2025-06-30T04:22:39.000000Z',
      actualizado: '2025-06-30T04:22:39.000000Z',
    };

    const fetchRoom = async () => {
      try {
        const response = await apiClient.get(`/api/rooms/${roomId}`);
        setRoom(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching room:', err);
        setError('No se pudo cargar la sala. Mostrando datos estáticos.');
        setRoom(staticRoom);
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  if (error) {
    return (
      <div className="text-center text-red-600 bg-red-100 p-4 rounded-md max-w-4xl m-auto">
        {error}
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
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{room.nombre}</h2>
      <div className="my-4">
        <Link
          className="bg-indigo-100 text-indigo-700 hover:bg-indigo-300 py-2 px-4 rounded"
          to={`/museums/${museumId}`}
        >
          Volver
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img
            src={room.imagen || 'https://via.placeholder.com/300x200?text=Room'}
            alt={room.nombre}
            className="w-full h-64 object-cover rounded-md"
          />
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">ID:</span> {room.id}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Creado:</span>{' '}
            {new Date(room.creado).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Actualizado:</span>{' '}
            {new Date(room.actualizado).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800">Descripción</h3>
        <p className="text-sm text-gray-600">{room.descripcion}</p>
      </div>
    </div>
  );
}