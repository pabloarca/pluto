import React, { useState } from 'react';
import { storeLink } from '../firebase'; // Asegúrate de crear esta función en firebase.js

const Screenshot = () => {
  const [link, setLink] = useState('');

  const handleStoreLink = async () => {
    try {
      await storeLink(link);
      alert('Link almacenado con éxito');
      setLink(''); // Limpiar el campo de entrada después de almacenar
    } catch (error) {
      console.error('Error al almacenar el link:', error);
      alert('Error al almacenar el link');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-5 text-center">Página Privada</h2>
        <p className="text-center mb-5">Introduce el link de la página web que quieres almacenar:</p>
        <div className="mb-4">
          <input
            type="url"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Introduce el link de la página web"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
        <button
          onClick={handleStoreLink}
          className="w-full bg-blue-500 text-white p-2 rounded mt-4"
        >
          Almacenar
        </button>
      </div>
    </div>
  );
};

export default Screenshot;
