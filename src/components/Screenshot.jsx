import React from 'react';

const Screenshot = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-5 text-center">Página Privada</h2>
        <p className="text-center">Esta es la página privada a la que solo se puede acceder después de iniciar sesión.</p>
      </div>
    </div>
  );
};

export default Screenshot;
