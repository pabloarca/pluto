import React, { useState } from 'react';
import Spinner from './Spinner'; // Asegúrate de importar el componente Spinner

const Screenshot = () => {
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStoreLink = async () => {
    setIsLoading(true); // Mostrar el spinner
    setImageUrl(''); // Limpiar cualquier imagen anterior
    try {
      const response = await fetch('https://plutonode-service-bhkd7zhacq-no.a.run.app/screenshot', { // Reemplaza con la URL de tu servidor
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: link }),
      });

      if (!response.ok) {
        throw new Error('Failed to take screenshot');
      }

      const blob = await response.blob();
      const imageObjectUrl = URL.createObjectURL(blob);
      setImageUrl(imageObjectUrl);
    } catch (error) {
      console.error('Error taking screenshot:', error);
    } finally {
      setIsLoading(false); // Ocultar el spinner
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-5 text-center">Página Privada</h2>
      <p className="text-center mb-5">Introduce el link de la página web que quieres almacenar:</p>
      <div className="flex mb-4 w-full max-w-lg">
        <input
          type="url"
          className="flex-grow p-2 border border-gray-300 rounded-l"
          placeholder="Introduce el link de la página web"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button
          onClick={handleStoreLink}
          className="p-2 bg-blue-500 text-white rounded-r"
        >
          Almacenar
        </button>
      </div>
      {isLoading && <Spinner />} {/* Mostrar el spinner si isLoading es true */}
      {imageUrl && (
        <div className="flex justify-start w-full mt-5">
          <img src={imageUrl} alt="Screenshot" className="max-w-1/2 h-auto" />
        </div>
      )}
    </div>
  );
};

export default Screenshot;
