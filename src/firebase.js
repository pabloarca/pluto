import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Importar Firestore y funciones necesarias

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Inicializar Firestore

// Función para almacenar el link en Firestore
const storeLink = async (link) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user logged in');
  }

  const linkRef = doc(db, 'users', user.uid); // Documento del usuario actual
  await setDoc(linkRef, { link }, { merge: true });
};

export { auth, storeLink };
