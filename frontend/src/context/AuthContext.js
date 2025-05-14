import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isAdmin: localStorage.getItem('isAdmin') === 'true' || false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isValidToken = (token) => {
    if (!token) return false;
    try {
      const parts = token.split('.');
      return parts.length === 3;
    } catch {
      return false;
    }
  };

  const login = async (token, userData) => {
    if (!isValidToken(token)) {
      setError('Invalid token format');
      return false;
    }

    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData || {}));
      localStorage.setItem('isAdmin', userData?.isAdmin ? 'true' : 'false');
      
      setAuthState({ 
        token, 
        user: userData || {}, 
        isAdmin: userData?.isAdmin || false 
      });
      return true;
    } catch (err) {
      setError('Failed to save authentication data');
      return false;
    }
  };

  const logout = (redirect = true) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    setAuthState({ token: null, user: null, isAdmin: false });
    setError(null);
    if (redirect) navigate('/login');
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (!isValidToken(token)) {
      logout(false);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:4000/api/auth/me', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        validateStatus: (status) => status < 500
      });

      if (response.status === 401) {
        logout(false);
        return;
      }

      if (response.data?.user) {
        setAuthState({
          token,
          user: response.data.user,
          isAdmin: response.data.user.isAdmin || false
        });
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('isAdmin', response.data.user.isAdmin ? 'true' : 'false');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      logout(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Set up axios response interceptor
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      ...authState,
      loading,
      error,
      login, 
      logout, 
      checkAuth,
      isAuthenticated: !!authState.token,
      setAuthError: setError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);