import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './protectedRoute';
import { Home } from '../pages/Home';
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
    </Routes>
  );
};

export default AppRoutes;
