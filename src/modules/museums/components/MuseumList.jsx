import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import apiClient from '../../../api/apiClient';

export default function MuseumList() {
    const [museums, setMuseums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Lista estática como respaldo
        const staticMuseums = [
            {
                id: 5,
                nombre: 'Museo de Antropología',
                imagen: 'https://chamus.restteach.com//storage/museums/LinRpmTD8OwoYbwsTlRyVFzdD4NByHjmNJjjueix.jpg',
                hora_de_apertura: '09:00:00',
                hora_de_cierre: '16:00:00',
                latitud: 19.42625107,
                longitud: -99.18630006,
                descripcion: 'Es uno de los recintos museográficos más importantes de México y de América.',
                precio: 250,
                url: 'https://www.mna.inah.gob.mx/',
                numero_de_salas: 1,
                estado: 'active'
            }
        ];

        const fetchMuseums = async () => {
            try {
                const response = await apiClient.get('/api/museums');
                setMuseums(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching museums:', err);
                setError('No se pudieron cargar los museos. Mostrando lista estática.');
                setMuseums(staticMuseums);
                setLoading(false);
            }
        };

        fetchMuseums();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-600 text-lg animate-pulse">Cargando museos...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">Lista de Museos</h2>
            </div>
            <div className="flex gap-4 my-5">

                <Link
                    to="/museums/new"
                    className="bg-indigo-100 text-indigo-800 py-2 px-4 rounded-md hover:bg-indigo-300 transition duration-200"
                >
                    Agregar Museo
                </Link>

                

            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {museums.map((museum) => (
                    <div
                        key={museum.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
                    >
                        <img
                            src={museum.imagen || 'https://via.placeholder.com/300x200?text=Museum'}
                            alt={museum.nombre}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{museum.nombre}</h3>
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Ubicación:</span> {museum.latitud}, {museum.longitud}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Horario:</span> {museum.hora_de_apertura} - {museum.hora_de_cierre}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Precio:</span> ${museum.precio}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Salas:</span> {museum.numero_de_salas}
                            </p>
                            <p className="text-sm text-gray-500 line-clamp-3 mb-4">{museum.descripcion}</p>
                            <div className="flex  space-x-6">
                                <a
                                    href={museum.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-indigo-100 text-indigo-700  font-medium hover:bg-indigo-300 py-2 px-4 rounded"

                                >
                                    Visitar sitio
                                </a>
                                <Link
                                    to={`/museums/${museum.id}`}
                                    className="bg-indigo-100 text-indigo-700  font-medium hover:bg-indigo-300 py-2 px-4 rounded"
                                >
                                    Ver detalles
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}