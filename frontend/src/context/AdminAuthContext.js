import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in on mount
    const token = localStorage.getItem('adminToken');
    if (token) {
      loadAdmin();
    } else {
      setLoading(false);
    }
  }, []);

  const loadAdmin = async () => {
    try {
      // Temporarily set token for this request
      const token = localStorage.getItem('adminToken');
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const user = response.data.data.user;
      
      // Only set admin if role is admin
      if (user.role === 'admin') {
        setAdmin(user);
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      console.error('Load admin error:', error);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone, password) => {
    try {
      const response = await api.post('/auth/login', { phone, password });
      const { user, token } = response.data.data;
      
      // Only allow admin role
      if (user.role !== 'admin') {
        return {
          success: false,
          message: 'Access denied. Admin credentials required.'
        };
      }
      
      localStorage.setItem('adminToken', token);
      setAdmin(user);
      
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    loadAdmin
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};
