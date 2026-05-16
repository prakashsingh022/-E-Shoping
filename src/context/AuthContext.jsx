import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('adminUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        try {
          // Verify token and get latest permissions/data
          const { data } = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${parsedUser.token}` }
          });
          
          const freshUser = { ...data, token: parsedUser.token };
          setUser(freshUser);
          localStorage.setItem('adminUser', JSON.stringify(freshUser));
        } catch (error) {
          console.error('Session expired or invalid:', error.message);
          localStorage.removeItem('adminUser');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      console.log('Login successful, user data:', data);
      setUser(data);
      localStorage.setItem('adminUser', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'superadmin') return true;
    return user.permissions?.includes(permission);
  };

  const isSuperAdmin = () => {
    return user?.role === 'superadmin';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
