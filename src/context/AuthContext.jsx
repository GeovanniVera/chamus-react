import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('AUTH_TOKEN');
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      await apiClient.get('/api/user');
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error verifying session:', err);
      localStorage.removeItem('AUTH_TOKEN');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/api/login', { email, password });
      localStorage.setItem('AUTH_TOKEN', response.data.access_token);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Error logging in:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/api/logout');
      localStorage.removeItem('AUTH_TOKEN');
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);