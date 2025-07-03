import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import MuseumForm from './MuseumForm';

export default function MuseumEditForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [museumData, setMuseumData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);

    useEffect(() => {
        const fetchMuseum = async () => {
            try {
                const response = await apiClient.get(`/api/museums/${id}`);
                console.log('Datos del museo recibidos:', response.data); // Para depuración
                setMuseumData(response.data);
                setCurrentImage(response.data.image);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching museum:', err);
                setError('No se pudo cargar el museo para editar.');
                setLoading(false);
            }
        };

        fetchMuseum();
    }, [id]);

    const handleSubmit = async (formData) => {
        try {
            const formDataToSend = new FormData();

            // Esto es crucial para métodos PUT/PATCH con multipart/form-data en Laravel
            formDataToSend.append('_method', 'PUT');
            formDataToSend.append('name', formData.nombre);
            formDataToSend.append('opening_time', formData.hora_de_apertura);
            formDataToSend.append('clossing_time', formData.hora_de_cierre);
            formDataToSend.append('latitude', formData.latitud);
            formDataToSend.append('longitude', formData.longitud);
            formDataToSend.append('description', formData.descripcion);
            formDataToSend.append('ticket_price', formData.precio);
            formDataToSend.append('url', formData.url);
            formDataToSend.append('status', formData.estado);


            if (formData.imagen) {
                formDataToSend.append('image', formData.imagen);
            }

            // Asegúrate de que las categorías se envíen como un array de IDs
            formData.categories.forEach(categoryId => {
                formDataToSend.append('category_ids[]', categoryId);
            });

            // Para depuración: Muestra el valor que se va a enviar
            console.log("Datos del formulario a enviar:", Object.fromEntries(formDataToSend.entries()));
            console.log("Estado a enviar:", formDataToSend.get('status')); // Verificamos el valor del estado

            await apiClient.post(`/api/museums/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Dar un pequeño retraso para que el mensaje de éxito se vea en MuseumForm
            setTimeout(() => {
                navigate(`/museums/${id}`);
            }, 1500); // Navega después de 1.5 segundos

        } catch (err) {
            console.error('Error updating museum:', err);
            const errorMessage = err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : 'No se pudo actualizar el museo. Por favor, intenta de nuevo.';
            setError(errorMessage);

            if (err.response && err.response.status === 422 && err.response.data.errors) {
                console.error('Validation errors:', err.response.data.errors);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-600 text-lg animate-pulse">Cargando museo para editar...</div>
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

    if (!museumData) {
        return (
            <div className="text-center text-red-600 bg-red-100 p-4 rounded-md max-w-4xl m-auto">
                Museo no encontrado.
            </div>
        );
    }

    const initialFormData = {
        nombre: museumData.nombre,
        imagen: null,
        hora_de_apertura: museumData.hora_de_apertura?.substring(0, 5) || '09:00',
        hora_de_cierre: museumData.hora_de_cierre?.substring(0, 5) || '17:00',
        latitud: museumData.latitud,
        longitud: museumData.longitud,
        descripcion: museumData.descripcion,
        precio: museumData.precio,
        url: museumData.url,
        estado: museumData.estado,
        categories: museumData.categories?.map(category => category.id) || [] // Mapea a IDs
    };

    return (
        <div>
            <MuseumForm
                initialData={initialFormData}
                onSubmit={handleSubmit}
                isEditing={true}
                currentImage={currentImage}
            />
        </div>
    );
}