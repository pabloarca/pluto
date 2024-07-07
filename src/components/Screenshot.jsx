import React, { useState } from 'react';

const Screenshot = () => {
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleStoreLink = async () => {
    try {
      const response = await fetch('https://pluto-screenshotserver.vercel.app/screenshot', { // URL de tu servidor en Vercel
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
      alert('Screenshot taken successfully');
    } catch (error) {
      console.error('Error taking screenshot:', error);
      alert('Error taking screenshot');
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
        {imageUrl && (
          <div className="mt-5 text-center">
            <img src={imageUrl} alt="Screenshot" className="max-w-full h-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Screenshot;
