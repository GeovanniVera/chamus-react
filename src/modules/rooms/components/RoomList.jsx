import React from 'react';

const RoomsList = ({ rooms }) => {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800">Salas</h3>
        <p className="text-sm text-gray-600">No hay salas registradas.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Salas</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
          >
            <img
              src={room.imagen || 'https://via.placeholder.com/300x200?text=Room'}
              alt={room.nombre}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">{room.nombre}</h4>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">{room.descripcion}</p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Creado:</span>{' '}
                {new Date(room.creado).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Actualizado:</span>{' '}
                {new Date(room.actualizado).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



export default RoomsList;