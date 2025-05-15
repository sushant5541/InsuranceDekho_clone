// context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    isAdmin: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isValidToken = (token) => {
    return token && token.split('.').length === 3;
  };

  const saveAuth = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAdmin', userData?.isAdmin ? 'true' : 'false');
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
  };

  const login = async (token, userData) => {
    if (!isValidToken(token)) {
      setError('Invalid token format');
      return false;
    }

    saveAuth(token, userData);
    setAuthState({ token, user: userData, isAdmin: !!userData?.isAdmin });
    return true;
  };

  const logout = (redirect = true) => {
    clearAuth();
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
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200 && response.data?.user) {
        const user = response.data.user;
        setAuthState({ token, user, isAdmin: !!user.isAdmin });
        saveAuth(token, user);
      } else {
        logout(false);
      }
    } catch (err) {
      logout(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const interceptor = axios.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401) {
          logout();
        }
        return Promise.reject(err);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider value={{
      ...authState,
      isAuthenticated: !!authState.token,
      loading,
      error,
      login,
      logout,
      checkAuth,
      setAuthError: setError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
