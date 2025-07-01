import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../../api/apiClient';

export default function DiscountForm() {
  const { museumId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    discount: '',
    description: '',
    museum_id: museumId // Campo prellenado con el ID del museo
  });
  
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Validar descuento: debe ser un número entre 0 y 1
    const discountValue = parseFloat(formData.discount);
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 1) {
      newErrors.discount = 'El descuento debe ser un valor decimal entre 0 y 1 (ej: 0.15 para 15%)';
    }
    
    if (formData.description.trim().length < 5) {
      newErrors.description = 'La descripción debe tener al menos 5 caracteres';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({ ...formData, [name]: value });
    
    // Limpiar error cuando el usuario edita
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    
    // Validar formulario
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Crear objeto con los datos
      const dataToSend = {
        discount: parseFloat(formData.discount),
        description: formData.description,
        museum_id: formData.museum_id
      };

      // Enviar datos al servidor
      await apiClient.post('/api/discounts', dataToSend);
      
      // Manejar respuesta exitosa
      setSubmitSuccess('Descuento creado exitosamente!');
      setTimeout(() => navigate(`/museums/${museumId}`), 2000);
    } catch (err) {
      console.error('Error creating discount:', err);
      
      let errorMessage = 'No se pudo crear el descuento. Por favor, intenta de nuevo.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Crear Nuevo Descuento</h1>
        <Link 
          to={`/museums/${museumId}`}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 px-4 rounded-md transition"
        >
          Volver al Museo
        </Link>
      </div>
      
      {/* Mostrar información del museo asociado */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
        <h3 className="text-sm font-medium text-purple-800">Descuento para el museo:</h3>
        <p className="text-lg font-semibold text-purple-900">ID: {museumId}</p>
        <p className="text-sm text-purple-700 mt-1">
          Este descuento será asociado automáticamente al museo con este ID.
          No puedes cambiar este valor.
        </p>
      </div>
      
      {/* Mensajes de estado */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          <p className="font-medium">Error:</p>
          <p>{submitError}</p>
        </div>
      )}
      
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
          <p className="font-medium">Éxito:</p>
          <p>{submitSuccess}</p>
        </div>
      )}
      
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
            Valor del Descuento (decimal) *
          </label>
          <div className="relative">
            <input
              id="discount"
              name="discount"
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={formData.discount}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                errors.discount 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:ring-purple-200 focus:border-purple-500'
              }`}
              placeholder="Ej: 0.15 (para 15%)"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
              %
            </div>
          </div>
          {errors.discount && <p className="mt-1 text-sm text-red-600">{errors.discount}</p>}
          <p className="mt-1 text-xs text-gray-500">
            Ingrese el valor decimal del descuento (ej: 0.10 para 10%, 0.25 para 25%)
          </p>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del Descuento *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.description 
                ? 'border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-purple-200 focus:border-purple-500'
            }`}
            placeholder="Describe el descuento, condiciones, etc."
          ></textarea>
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          <p className="mt-1 text-xs text-gray-500">
            Ej: "Descuento para estudiantes", "Promoción de verano", etc.
          </p>
        </div>
        
        <div className="pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(`/museums/${museumId}`)}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`px-5 py-2.5 rounded-lg text-white font-medium transition ${
              isSubmitting 
                ? 'bg-purple-400 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando descuento...
              </div>
            ) : 'Crear Descuento'}
          </button>
        </div>
      </form>
      
      {/* Ejemplos de descuentos */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Ejemplos de valores de descuento:</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center bg-white p-2 rounded border">
            <div className="font-bold text-purple-600">10%</div>
            <div className="text-xs text-gray-500">0.10</div>
          </div>
          <div className="text-center bg-white p-2 rounded border">
            <div className="font-bold text-purple-600">25%</div>
            <div className="text-xs text-gray-500">0.25</div>
          </div>
          <div className="text-center bg-white p-2 rounded border">
            <div className="font-bold text-purple-600">50%</div>
            <div className="text-xs text-gray-500">0.50</div>
          </div>
        </div>
      </div>
    </div>
  );
}