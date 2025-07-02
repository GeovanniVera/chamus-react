import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import DiscountForm from './DiscountForm';

export default function DiscountEditForm() {
  const { museumId, discountId } = useParams();
  const navigate = useNavigate();
  const [discountData, setDiscountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const response = await apiClient.get(`/api/discounts/${discountId}`);
        console.log('Datos del descuento recibidos:', response.data);
        setDiscountData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching discount:', err);
        setError('No se pudo cargar el descuento para editar.');
        setLoading(false);
      }
    };

    fetchDiscount();
  }, [discountId]);

  const handleSubmit = async (formData) => {
    try {
      const dataToSend = {
        discount: parseFloat(formData.discount),
        description: formData.description,
        museum_id: formData.museum_id,
        _method: 'PUT'
      };

      await apiClient.post(`/api/discounts/${discountId}`, dataToSend);
    } catch (err) {
      console.error('Error updating discount:', err);
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'No se pudo actualizar el descuento. Por favor, intenta de nuevo.';
      throw new Error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 text-lg animate-pulse">Cargando descuento para editar...</div>
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

  if (!discountData) {
    return (
      <div className="text-center text-red-600 bg-red-100 p-4 rounded-md max-w-4xl m-auto">
        Descuento no encontrado.
      </div>
    );
  }

  const initialFormData = {
    discount: discountData.valor_descuento || discountData.discount || '',
    description: discountData.primera_descripcion_pivote || discountData.description || '',
    museum_id: museumId
  };
  

  return (
    <DiscountForm
      initialData={initialFormData}
      onSubmit={handleSubmit}
      isEditing={true}
    />
  );
}