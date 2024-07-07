import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Screenshot from './components/Screenshot';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

const PrivateRoute = ({ children }) => {
  const [user] = useAuthState(auth);
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route
          path="/screenshot"
          element={
            <PrivateRoute>
              <Screenshot />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
