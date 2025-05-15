import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check token expiration and user data on mount and periodically
  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('userData');
      if (!userData) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const parsedData = JSON.parse(userData);
        const now = new Date().getTime();

        // Check if token is expired
        if (now >= parsedData.expiryTime) {
          handleLogout("Session expired. Please login again.");
          return;
        }

        // If token is valid, set the user
        setUser(parsedData);
        
        // Set up automatic logout 5 minutes before expiry
        const timeUntilExpiry = parsedData.expiryTime - now;
        if (timeUntilExpiry > 5 * 60 * 1000) { // If more than 5 minutes left
          const warningTimeout = setTimeout(() => {
            toast.warning("Your session will expire in 5 minutes. Please save your work.", {
              autoClose: 4000
            });
          }, timeUntilExpiry - 5 * 60 * 1000);

          return () => clearTimeout(warningTimeout);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    // Check auth status every minute
    const interval = setInterval(checkAuth, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Update axios interceptor for handling 401 responses
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          handleLogout("Session expired. Please login again.");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const handleLogout = async (message = "You have been logged out.") => {
    try {
      // Call logout endpoint if user exists
      if (user) {
        await axiosInstance.post('/admin/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('userData');
      setUser(null);
      
      // Show logout message
      toast.info(message);
      
      // Instead of using navigate, we'll use window.location
      window.location.href = '/admin/login';
    }
  };

  const value = {
    user,
    login,
    logout: handleLogout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};