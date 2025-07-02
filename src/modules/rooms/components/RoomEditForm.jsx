import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import RoomForm from './RoomForm';

export default function RoomEditForm() {
  const { museumId, roomId } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await apiClient.get(`/api/rooms/${roomId}`);
        console.log('Datos de la sala recibidos:', response.data);
        setRoomData(response.data);
        setCurrentImage(response.data.image);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching room:', err);
        setError('No se pudo cargar la sala para editar.');
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleSubmit = async (formData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('_method', 'PUT');
      formDataToSend.append('name', formData.nombre);
      if (formData.imagen) {
        formDataToSend.append('image', formData.imagen);
      }
      formDataToSend.append('description', formData.descripcion);
      formDataToSend.append('museum_id', formData.museum_id);

      console.log('Datos enviados al backend:', Object.fromEntries(formDataToSend.entries()));

      await apiClient.post(`/api/rooms/${roomId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setTimeout(() => {
        navigate(`/museums/${museumId}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating room:', err);
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'No se pudo actualizar la sala. Por favor, intenta de nuevo.';
      setError(errorMessage);

      if (err.response && err.response.status === 422 && err.response.data.errors) {
        console.error('Validation errors:', err.response.data.errors);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 text-lg animate-pulse">Cargando sala para editar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 bg-red-100 p-4 rounded-md max-w-4xl m-auto">
        {error}
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="text-center text-red-600 bg-red-100 p-4 rounded-md max-w-4xl m-auto">
        Sala no encontrada.
      </div>
    );
  }

  const initialFormData = {
    nombre: roomData.nombre || '',
    imagen: null,
    descripcion: roomData.descripcion || '',
    museum_id: museumId
  };

  return (
    <div>
      <RoomForm
        initialData={initialFormData}
        onSubmit={handleSubmit}
        isEditing={true}
        currentImage={currentImage}
        museumId={museumId}
      />
    </div>
  );
}