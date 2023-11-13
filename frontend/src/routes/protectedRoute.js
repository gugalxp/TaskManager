import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/auth';

function ProtectedRoute({children}) {
  const { signed, userAuth } = useContext(AuthContext);  

  return signed || userAuth ? children : <Navigate to="/login" />
};

export default ProtectedRoute;
