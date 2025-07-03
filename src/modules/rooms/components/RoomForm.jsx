import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import { useParams } from 'react-router-dom';

export default function RoomForm({ initialData, onSubmit, isEditing = false, currentImage = null }) {
  const navigate = useNavigate();
  const { museumId} = useParams();

  const [formData, setFormData] = useState(
    initialData || {
      nombre: '',
      imagen: null,
      descripcion: '',
      museum_id: museumId // Campo prellenado con el ID del museo
    }
  );

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!isEditing && !formData.imagen) {
      newErrors.imagen = 'Debes seleccionar una imagen';
    } else if (formData.imagen && !['image/jpeg', 'image/png'].includes(formData.imagen.type)) {
      newErrors.imagen = 'La imagen debe ser un archivo JPG o PNG';
    }

    if (formData.descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'imagen') {
      setFormData({ ...formData, imagen: files[0] || null });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing && onSubmit) {
        await onSubmit(formData);
        setSubmitSuccess('Sala actualizada exitosamente!');
      } else {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.nombre);
        formDataToSend.append('image', formData.imagen);
        formDataToSend.append('description', formData.descripcion);
        formDataToSend.append('museum_id', formData.museum_id);

        await apiClient.post('/api/rooms', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setSubmitSuccess('Sala creada exitosamente!');
        setTimeout(() => navigate(`/museums/${museumId}`), 2000);
      }
    } catch (err) {
      console.error('Error saving room:', err);

      let errorMessage = isEditing
        ? 'No se pudo actualizar la sala. Por favor, intenta de nuevo.'
        : 'No se pudo crear la sala. Por favor, intenta de nuevo.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }

      setSubmitError(errorMessage);

      if (err.response && err.response.status === 422 && err.response.data.errors) {
        const backendErrors = err.response.data.errors;
        const mappedErrors = {};
        for (const key in backendErrors) {
          let fieldName = key;
          if (key === 'name') fieldName = 'nombre';
          if (key === 'image') fieldName = 'imagen';
          if (key === 'description') fieldName = 'descripcion';
          mappedErrors[fieldName] = backendErrors[key][0];
        }
        setErrors(mappedErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Editar Sala' : 'Crear Nueva Sala'}
        </h1>
        <Link
          to={`/museums/${museumId}`}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 px-4 rounded-md transition"
        >
          Volver al Museo
        </Link>
      </div>

      <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-blue-100">
        <h3 className="text-sm font-medium text-purple-800">Sala para el museo:</h3>
        <p className="text-lg font-semibold text-purple-900">ID: {museumId}</p>
        <p className="text-sm text-purple-700 mt-1">
          Esta sala será asociada automáticamente al museo con este ID.
          No puedes cambiar este valor.
        </p>
      </div>

      {isEditing && currentImage && !formData.imagen && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>
          <img
            src={currentImage}
            alt="Imagen actual de la sala"
            className="w-64 h-48 object-cover rounded-md"
          />
        </div>
      )}

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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Sala *
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.nombre
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
            }`}
            placeholder="Ej: Sala de Arte Contemporáneo"
          />
          {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción *
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.descripcion
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
            }`}
            placeholder="Describe esta sala, sus características principales y las obras que contiene..."
          ></textarea>
          {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>}
        </div>

        <div>
          <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-1">
            Imagen de la Sala *
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              errors.imagen ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
            }`}
          >
            <input
              id="imagen"
              name="imagen"
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleChange}
              className="hidden"
            />
            <label htmlFor="imagen" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <p className="text-sm text-gray-600">
                  {formData.imagen ? (
                    <span className="font-medium">{formData.imagen.name}</span>
                  ) : (
                    'Haz clic para seleccionar una imagen'
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">Formatos permitidos: JPG, PNG</p>
                <p className="text-xs text-gray-500">Tamaño máximo: 5MB</p>
              </div>
            </label>
          </div>
          {errors.imagen && <p className="mt-1 text-sm text-red-600">{errors.imagen}</p>}
          {isEditing && (
            <p className="text-xs text-gray-500 mt-1">
              Deja este campo vacío si no deseas cambiar la imagen.
            </p>
          )}

          {formData.imagen && (
            <div className="mt-4 flex justify-center">
              <div className="border rounded-lg p-2 max-w-xs">
                <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
                <img
                  src={URL.createObjectURL(formData.imagen)}
                  alt="Vista previa"
                  className="max-h-40 mx-auto"
                />
              </div>
            </div>
          )}
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
            className={`px-5 py-2.5 rounded-lg text-purple-800 font-medium transition ${
              isSubmitting ? 'bg-purple-100 cursor-not-allowed' : 'bg-purple-200 hover:bg-purple-300'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEditing ? 'Actualizando sala...' : 'Creando sala...'}
              </div>
            ) : isEditing ? 'Actualizar Sala' : 'Crear Sala'}
          </button>
        </div>
      </form>
    </div>
  );
}