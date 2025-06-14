// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    // If a user is logged in, render the child component (the protected page).
    // Otherwise, redirect them to the login page.
    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;