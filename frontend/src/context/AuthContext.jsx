import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('accessToken');
      
      // Prevent making an API call if we know there is no token (avoids 401 error console logs)
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me'); // Check this route exists in backend
        if (res.data.status === 'success') {
          setUser(res.data.data.user);
        }
      } catch (err) {
        console.log('User not logged in or token expired');
        setUser(null);
        // Optionally, clear the invalid token
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      if (res.data.status === 'success') {
        const { accessToken } = res.data;
        const { user } = res.data.data;
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        }
        setUser(user);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const verifyOTP = async (verifyData) => {
    try {
      const res = await api.post('/auth/verify-otp', verifyData);
      if (res.data.status === 'success') {
        const { accessToken } = res.data;
        const { user } = res.data.data;
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        }
        setUser(user);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('accessToken');
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const value = {
    user,
    loading,
    setUser,
    login,
    logout,
    verifyOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
