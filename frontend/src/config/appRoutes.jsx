

import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LandingPage from '../pages/landingPage';
import InitializeBot from '../pages/initializeBot';
import Dashboard from '../pages/dashboard'; 
import Login from '../pages/login';
import Register from '../pages/register';

function AppRoutes() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('authToken') // Example of checking login status
  );

  return (
    <Routes>

      <Route path='/' element={<LandingPage />} />
    
      <Route
        path="/login"
        element={
          isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      
      <Route
        path="/register"
        element={
          isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />
        }
      />
   
      <Route path='/initialize' element={<InitializeBot />} />

      <Route
        path="/dashboard"
        element={
          isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default AppRoutes;
