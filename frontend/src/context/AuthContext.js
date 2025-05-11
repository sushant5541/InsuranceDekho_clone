import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAdmin: localStorage.getItem('isAdmin') === 'true' || false
  });
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAdmin', userData.isAdmin ? 'true' : 'false');
    setAuthState({ 
      token, 
      user: userData, 
      isAdmin: userData.isAdmin || false 
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    setAuthState({ token: null, user: null, isAdmin: false });
    navigate('/login');
  };

  const silentLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    setAuthState({ token: null, user: null, isAdmin: false });
  };

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      
      const response = await axios.get('http://localhost:4000/api/admin/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        localStorage.setItem('isAdmin', 'true');
        setAuthState(prev => ({ ...prev, isAdmin: true }));
        return true;
      }
    } catch (err) {
      localStorage.setItem('isAdmin', 'false');
      setAuthState(prev => ({ ...prev, isAdmin: false }));
      return false;
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        silentLogout(); // Don't navigate, just clear state
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:4000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data?.user) {
          setAuthState({
            token,
            user: response.data.user,
            isAdmin: response.data.user.isAdmin || false
          });
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('isAdmin', response.data.user.isAdmin ? 'true' : 'false');
        } else {
          silentLogout(); // Don't navigate, just clear state
        }
      } catch (err) {
        silentLogout(); // Don't navigate, just clear state
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      loading,
      login, 
      logout, 
      checkAdminStatus,
      isAuthenticated: authState.token !== null 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);