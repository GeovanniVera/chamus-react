import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../../api/apiClient';

export default function MuseumDetail() {
  const [museum, setMuseum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const staticMuseum = {
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
      estado: 'active',
      creado: '2025-06-08T06:38:07.000000Z',
      actualizado: '2025-06-08T06:38:07.000000Z',
      rooms: [],
      categories: [],
      descuentos_asociados: []
    };

    const fetchMuseum = async () => {
      try {
        const response = await apiClient.get(`/api/museums/${id}`);
        setMuseum(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching museum:', err);
        setError('No se pudo cargar el museo. Mostrando datos estáticos.');
        setMuseum(staticMuseum);
        setLoading(false);
      }
    };

    fetchMuseum();
  }, [id]);

  const handleDeleteMuseum = async () => {
    if (!window.confirm(`¿Estás seguro que deseas eliminar el museo "${museum.nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      await apiClient.delete(`/api/museums/${id}`);
      navigate('/museums');
    } catch (err) {
      console.error('Error eliminando museo:', err);
      setDeleteError('No se pudo eliminar el museo. Por favor intenta de nuevo.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteDiscount = async (discountId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este descuento?')) return;

    try {
      await apiClient.delete(`/api/discounts/${discountId}`);
      setMuseum({
        ...museum,
        descuentos_asociados: museum.descuentos_asociados.filter(d => d.id !== discountId)
      });
    } catch (err) {
      console.error('Error eliminando descuento:', err);
      setDeleteError('No se pudo eliminar el descuento. Por favor intenta de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 text-lg animate-pulse">Cargando detalles del museo...</div>
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

  if (!museum) {
    return (
      <div className="text-center text-red-600 bg-red-100 p-4 rounded-md max-w-4xl m-auto">
        Museo no encontrado.
      </div>
    );
  }

  return (
    <div className="max-w-4xl m-auto w-full bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{museum.nombre}</h2>
        <div className="flex space-x-2">
          <Link
            to={`/museums/edit/${museum.id}`}
            className="bg-yellow-100 text-yellow-800 py-2 px-4 rounded-md hover:bg-yellow-200 transition duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Editar
          </Link>
          <button
            onClick={handleDeleteMuseum}
            disabled={isDeleting}
            className={`py-2 px-4 rounded-md flex items-center ${
              isDeleting 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            }`}
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-red-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Eliminando...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Eliminar
              </>
            )}
          </button>
        </div>
      </div>

      {deleteError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {deleteError}
        </div>
      )}

      <div className="my-4 flex flex-wrap gap-2">
        <Link
          className="bg-purple-100 text-purple-700 hover:bg-purple-300 py-2 px-4 rounded flex items-center"
          to="/museums"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver
        </Link>

        <Link
          to={`/rooms/new/${museum.id}`}
          className="bg-green-100 text-green-800 py-2 px-4 rounded-md hover:bg-green-200 transition duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Agregar Sala
        </Link>

        <Link
          to={`/discounts/new/${museum.id}`}
          className="bg-indigo-100 text-indigo-800 py-2 px-4 rounded-md hover:bg-indigo-200 transition duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Agregar Descuento
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img
            src={museum.imagen || 'https://via.placeholder.com/300x200?text=Museum'}
            alt={museum.nombre}
            className="w-full h-64 object-cover rounded-md"
          />
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Horario:</span> {museum.hora_de_apertura} - {museum.hora_de_cierre}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Ubicación:</span> Lat {museum.latitud}, Lon {museum.longitud}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Precio:</span> ${museum.precio}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Número de Salas:</span> {museum.numero_de_salas}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Estado:</span> {museum.estado === 'active' ? 'Activo' : 'Inactivo'}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Sitio Web:</span>{' '}
            <a
              href={museum.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {museum.url}
            </a>
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Creado:</span> {new Date(museum.creado).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Actualizado:</span> {new Date(museum.actualizado).toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800">Descripción</h3>
        <p className="text-sm text-gray-600">{museum.descripcion}</p>
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Categorías</h3>
          <Link 
            to="/categories" 
            className="text-sm text-blue-600 hover:underline"
          >
            Administrar categorías
          </Link>
        </div>
        {museum.categories && museum.categories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {museum.categories.map(category => (
              <span 
                key={category.id} 
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
              >
                {category.nombre}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No hay categorías asignadas.</p>
        )}
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Descuentos</h3>
        {museum.descuentos_asociados && museum.descuentos_asociados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {museum.descuentos_asociados.map(descuento => (
              <div 
                key={descuento.id} 
                className="bg-purple-50 border border-purple-100 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-purple-800">
                      {(descuento.valor_descuento * 100).toFixed(0)}% de descuento
                    </h4>
                    <p className="text-sm text-purple-700 mt-1">
                      {descuento.descripcion_aplicacion}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/museums/${id}/discounts/${descuento.id}/edit`}
                      state={{ museumId: id }}
                      className="bg-blue-100 text-blue-800 py-1 px-2 rounded-md hover:bg-blue-200 transition duration-200 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDeleteDiscount(descuento.id)}
                      className="bg-red-100 text-red-800 py-1 px-2 rounded-md hover:bg-red-200 transition duration-200 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No hay descuentos disponibles.</p>
        )}
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-5">Salas</h3>
        {museum.rooms && museum.rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {museum.rooms.map((room) => (
              <div 
                key={room.id} 
                className='p-4 shadow rounded-lg hover:border hover:border-indigo-300 transition-all'
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={room.imagen || 'https://via.placeholder.com/100x100?text=Sala'} 
                      alt={room.nombre}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <Link
                      to={`/rooms/${room.id}`}
                      state={{ museumId: id }}
                      className='font-bold text-indigo-700 hover:underline'
                    >
                      {room.nombre}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {room.descripcion}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      Creado: {new Date(room.creado).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No hay salas registradas.</p>
        )}
      </div>
    </div>
  );
}