import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient'; // Asegúrate de que la ruta sea correcta

// Componente Modal para mostrar los detalles de la cotización
function QuoteModal({ isOpen, onClose, quoteDetails }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
          aria-label="Cerrar modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Detalles de la Cotización</h2>
        {quoteDetails ? (
          <div className="space-y-3 text-gray-700 text-sm">
            {Object.entries(quoteDetails).map(([key, value]) => {
              if (typeof value === 'object' && value !== null) {
                return (
                  <div key={key} className="border-t pt-3 mt-3 first:border-t-0 first:pt-0 first:mt-0">
                    <strong className="block text-base text-gray-900 mb-1 capitalize">{key.replace(/_/g, ' ')}:</strong>
                    <div className="pl-4 space-y-2">
                      {Object.entries(value).map(([subKey, subValue]) => (
                        <p key={`${key}-${subKey}`} className="flex flex-col sm:flex-row sm:items-baseline">
                          <strong className="w-40 text-gray-800 capitalize">{subKey.replace(/_/g, ' ')}:</strong>
                          <span className="flex-1 break-words">{String(subValue)}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <p key={key} className="flex flex-col sm:flex-row sm:items-baseline">
                  <strong className="w-40 text-gray-900 capitalize">{key.replace(/_/g, ' ')}:</strong>
                  <span className="flex-1 break-words">{String(value)}</span>
                </p>
              );
            })}
          </div>
        ) : (
          <p>No hay detalles para mostrar.</p>
        )}
      </div>
    </div>
  );
}

export default function ListCotizaciones() {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/api/cotizaciones');
        setQuotes(response.data);
      } catch (err) {
        console.error('Error al recuperar las cotizaciones:', err);
        setError('Error al cargar las cotizaciones. Por favor, inténtelo de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  const handleViewDetails = (quote) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuote(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Cotizaciones</h1>

      {isLoading ? (
        <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="ml-3 text-gray-700">Cargando cotizaciones...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">¡Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      ) : quotes.length === 0 ? (
        <div className="p-6 bg-white rounded-lg shadow-md text-gray-700">
          <p>No hay cotizaciones disponibles.</p>
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID Único
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Museo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {quote.unique_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {quote.museum.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(quote)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <QuoteModal isOpen={isModalOpen} onClose={handleCloseModal} quoteDetails={selectedQuote} />
    </div>
  );
}