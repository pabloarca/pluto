import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import Spinner from './Spinner'; // Asegúrate de importar el componente Spinner
import { storage, firestore } from '../firebase'; // Importa storage y firestore configurados

const Screenshot = () => {
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStoreLink = async () => {
    setIsLoading(true); // Mostrar el spinner
    setImageUrl(''); // Limpiar cualquier imagen anterior
    setError(''); // Limpiar errores anteriores
    setResult(null); // Limpiar resultados anteriores

    try {
      console.log('Starting screenshot process');
      const response = await fetch('/api/screenshot', { // URL de tu servidor
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: link }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error during screenshot fetch:', errorText);
        throw new Error(errorText || 'Failed to take screenshot');
      }

      const blob = await response.blob();
      console.log('Screenshot taken, uploading to Firebase Storage');

      // Subir la imagen a Firebase Storage
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.log('User not logged in');
        throw new Error('User not logged in');
      }

      const storageRef = ref(storage, `screenshots/${user.uid}/${Date.now()}.png`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Image uploaded to Firebase Storage, URL:', downloadURL);
      
      // Guardar la URL en Firestore
      const docRef = doc(firestore, `users/${user.uid}/screenshots/${Date.now()}`);
      await setDoc(docRef, {
        url: downloadURL,
        createdAt: new Date(),
      });

      setImageUrl(downloadURL);

      // Enviar la solicitud al Worker de Cloudflare
      console.log('Sending request to Cloudflare Worker with image URL:', downloadURL);
      const analyzeResponse = await fetch('https://backend.estac-343.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageUrl: downloadURL })
      });

      if (!analyzeResponse.ok) {
        const errorText = await analyzeResponse.text();
        console.log('Error during analysis fetch:', errorText);
        throw new Error(errorText || 'Failed to analyze image');
      }

      const analyzeResult = await analyzeResponse.json();
      console.log('Analysis result:', analyzeResult);
      setResult(analyzeResult.choices[0]);
    } catch (error) {
      console.error('Error taking screenshot or analyzing:', error);
      setError(error.message);
    } finally {
      setIsLoading(false); // Ocultar el spinner
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-5 text-center">Plutonode</h2>
      <p className="text-center mb-5">Introduce el link de la página web que quieres que analicemos:</p>
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
          Analizar
        </button>
      </div>
      {isLoading && <Spinner />} {/* Mostrar el spinner si isLoading es true */}
      {error && (
        <div className="text-red-500 mt-4">
          <p>Error: {error}</p>
        </div>
      )}
      <div className="flex w-full mt-5">
        {imageUrl && (
          <div className="flex-shrink-0 w-1/2 pr-4">
            <img src={imageUrl} alt="Screenshot" className="w-full h-auto border border-gray-300 shadow-lg" /> {/* Miniatura */}
          </div>
        )}
        {result && (
          <div className="flex-grow">
            <h3 className="text-xl font-bold">Result:</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Screenshot;
