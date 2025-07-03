import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../../api/apiClient';

export default function MuseumForm({ initialData, onSubmit, isEditing = false, currentImage = null }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialData || {
        nombre: '',
        imagen: null,
        hora_de_apertura: '09:00',
        hora_de_cierre: '17:00',
        latitud: '',
        longitud: '',
        descripcion: '',
        precio: '',
        url: '',
        estado: 'active', // Valor por defecto para creación
        categories: []
    });

    useEffect(() => {
        if (isEditing && initialData) {
            setFormData({
                nombre: initialData.nombre || '',
                imagen: null, // Mantener null para permitir cambiar la imagen
                hora_de_apertura: initialData.hora_de_apertura || '09:00',
                hora_de_cierre: initialData.hora_de_cierre || '17:00',
                latitud: initialData.latitud || '',
                longitud: initialData.longitud || '',
                descripcion: initialData.descripcion || '',
                precio: initialData.precio || '',
                url: initialData.url || '',
                estado: initialData.estado || 'active',
                categories: initialData.categories || []
            });
        }
    }, [initialData, isEditing]);

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get('/api/categories');
                setCategories(response.data);
                setLoadingCategories(false);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setSubmitError('No se pudieron cargar las categorías. Por favor intenta más tarde.');
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (formData.nombre.length < 3) {
            newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
        }

        if (!isEditing && !formData.imagen) {
            newErrors.imagen = 'Debes seleccionar una imagen';
        } else if (formData.imagen && !['image/jpeg', 'image/png', 'image/webp'].includes(formData.imagen.type)) {
            newErrors.imagen = 'La imagen debe ser un archivo JPG o PNG';
        }

        if (!formData.latitud || isNaN(formData.latitud)) {
            newErrors.latitud = 'La latitud debe ser un número válido';
        }
        if (!formData.longitud || isNaN(formData.longitud)) {
            newErrors.longitud = 'La longitud debe ser un número válido';
        }
        if (formData.precio === '' || isNaN(formData.precio) || parseFloat(formData.precio) < 0) {
            newErrors.precio = 'El precio debe ser un número mayor o igual a 0';
        }
        if (formData.url && !formData.url.match(/^https?:\/\/.+/)) {
            newErrors.url = 'La URL debe comenzar con http:// o https://';
        }
        
        if (formData.categories.length === 0) {
            newErrors.categories = 'Debes seleccionar al menos una categoría';
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
        setErrors({ ...errors, [name]: null });
    };

    const handleCategoryChange = (categoryId) => {
        setErrors({ ...errors, categories: null });

        setFormData(prev => {
            if (prev.categories.includes(categoryId)) {
                return {
                    ...prev,
                    categories: prev.categories.filter(id => id !== categoryId)
                };
            } else {
                return {
                    ...prev,
                    categories: [...prev.categories, categoryId]
                };
            }
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setSubmitError(null);
            setSubmitSuccess(null);

            if (onSubmit) {
                await onSubmit(formData);
                setSubmitSuccess('Museo actualizado exitosamente');
            } else {
                const formDataToSend = new FormData();
                formDataToSend.append('name', formData.nombre);
                if (formData.imagen) {
                    formDataToSend.append('image', formData.imagen);
                }

                formDataToSend.append('opening_time', formData.hora_de_apertura);
                formDataToSend.append('clossing_time', formData.hora_de_cierre);
                formDataToSend.append('latitude', formData.latitud);
                formDataToSend.append('longitude', formData.longitud);
                formDataToSend.append('description', formData.descripcion);
                formDataToSend.append('ticket_price', formData.precio);
                formDataToSend.append('url', formData.url);
                formDataToSend.append('status', formData.estado);
                formData.categories.forEach(categoryId => {
                    formDataToSend.append('category_ids[]', categoryId);
                });
                await apiClient.post('/api/museums', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setSubmitSuccess('Museo creado exitosamente');
                setTimeout(() => navigate('/museums'), 2000);
            }
        } catch (err) {
            console.error('Error saving museum:', err);
            const errorMessage = err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : 'No se pudo guardar el museo. Por favor, intenta de nuevo.';
            setSubmitError(errorMessage);
            setSubmitSuccess(null);

            if (err.response && err.response.status === 422 && err.response.data.errors) {
                const backendErrors = err.response.data.errors;
                const mappedErrors = {};
                for (const key in backendErrors) {
                    let fieldName = key;
                    if (key === 'name') fieldName = 'nombre';
                    if (key === 'image') fieldName = 'imagen';
                    if (key === 'opening_time') fieldName = 'hora_de_apertura';
                    if (key === 'clossing_time') fieldName = 'hora_de_cierre';
                    if (key === 'ticket_price') fieldName = 'precio';
                    if (key === 'status') fieldName = 'estado';
                    if (key === 'category_ids') fieldName = 'categories';

                    mappedErrors[fieldName] = backendErrors[key][0];
                }
                setErrors(mappedErrors);
            }
        }
    };

    return (
        <div className="max-w-4xl m-auto w-full bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                {isEditing ? 'Editar Museo' : 'Crear Museo'}
            </h2>
            <div className="my-4">
                <Link
                    className="bg-purple-100 text-purple-700 hover:bg-purple-300 py-2 px-4 rounded"
                    to={'/museums'}
                >
                    Volver
                </Link>
            </div>
            {submitError && (
                <div className="text-red-600 bg-red-100 p-3 rounded-md mb-4">{submitError}</div>
            )}
            {submitSuccess && (
                <div className="text-green-600 bg-green-100 p-3 rounded-md mb-4">{submitSuccess}</div>
            )}
            <form onSubmit={handleFormSubmit} className="space-y-6" noValidate>
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                        Nombre del Museo
                    </label>
                    <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full px-3 py-2 border ${errors.nombre ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Ej. Museo de Antropología"
                    />
                    {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                </div>

                <div>
                    <label htmlFor="imagen" className="block text-sm font-medium text-gray-700">
                        Imagen del Museo
                    </label>

                    {isEditing && currentImage && !formData.imagen && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>
                            <img
                                src={currentImage}
                                alt="Imagen actual del museo"
                                className="w-64 h-48 object-cover rounded-md"
                            />
                        </div>
                    )}

                    <input
                        id="imagen"
                        name="imagen"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.imagen ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.imagen && <p className="text-red-500 text-sm mt-1">{errors.imagen}</p>}
                    {isEditing && (
                        <p className="text-xs text-gray-500 mt-1">
                            Deja este campo vacío si no deseas cambiar la imagen.
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categorías *
                    </label>

                    {loadingCategories ? (
                        <div className="mt-2 text-sm text-gray-500">Cargando categorías...</div>
                    ) : (
                        <div className="space-y-2">
                            <div className={`p-4 border rounded-md ${errors.categories ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {categories.map(category => (
                                        <div key={category.id} className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id={`category-${category.id}`}
                                                    type="checkbox"
                                                    checked={formData.categories.includes(category.id)}
                                                    onChange={() => handleCategoryChange(category.id)}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label
                                                    htmlFor={`category-${category.id}`}
                                                    className="font-medium text-gray-700 cursor-pointer"
                                                >
                                                    {category.nombre}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {errors.categories && (
                                <p className="text-red-500 text-sm mt-1">{errors.categories}</p>
                            )}
                            <p className="text-xs text-gray-500">
                                * Debes seleccionar al menos una categoría
                            </p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="hora_de_apertura" className="block text-sm font-medium text-gray-700">
                            Hora de Apertura
                        </label>
                        <input
                            id="hora_de_apertura"
                            name="hora_de_apertura"
                            type="time"
                            value={formData.hora_de_apertura}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="hora_de_cierre" className="block text-sm font-medium text-gray-700">
                            Hora de Cierre
                        </label>
                        <input
                            id="hora_de_cierre"
                            name="hora_de_cierre"
                            type="time"
                            value={formData.hora_de_cierre}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="latitud" className="block text-sm font-medium text-gray-700">
                            Latitud
                        </label>
                        <input
                            id="latitud"
                            name="latitud"
                            type="number"
                            step="any"
                            value={formData.latitud}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full px-3 py-2 border ${errors.latitud ? 'border-red-500' : 'border-gray-300'
                                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="Ej. 19.42625107"
                        />
                        {errors.latitud && <p className="text-red-500 text-sm mt-1">{errors.latitud}</p>}
                    </div>
                    <div>
                        <label htmlFor="longitud" className="block text-sm font-medium text-gray-700">
                            Longitud
                        </label>
                        <input
                            id="longitud"
                            name="longitud"
                            type="number"
                            step="any"
                            value={formData.longitud}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full px-3 py-2 border ${errors.longitud ? 'border-red-500' : 'border-gray-300'
                                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="Ej. -99.18630006"
                        />
                        {errors.longitud && <p className="text-red-500 text-sm mt-1">{errors.longitud}</p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                        Descripción
                    </label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        rows="4"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Descripción del museo"
                    />
                </div>

                <div>
                    <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
                        Precio
                    </label>
                    <input
                        id="precio"
                        name="precio"
                        type="number"
                        value={formData.precio}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full px-3 py-2 border ${errors.precio ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Ej. 250"
                    />
                    {errors.precio && <p className="text-red-500 text-sm mt-1">{errors.precio}</p>}
                </div>

                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                        URL del Sitio
                    </label>
                    <input
                        id="url"
                        name="url"
                        type="url"
                        value={formData.url}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full px-3 py-2 border ${errors.url ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Ej. https://www.mna.inah.gob.mx/"
                    />
                    {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
                </div>

                

                <div>
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                        Estado
                    </label>
                    <select
                        id="estado"
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate(isEditing ? `/museums/${initialData?.id}` : '/museums')}
                        className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="py-2 px-4 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200"
                    >
                        {isEditing ? 'Actualizar Museo' : 'Guardar Museo'}
                    </button>
                </div>
            </form>
        </div>
    );
}