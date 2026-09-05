import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, notificationsAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUser = async () => {
    const token = localStorage.getItem('sih_auth_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await authAPI.getMe();
      setUser(data.user);
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to load user session:', err);
      localStorage.removeItem('sih_auth_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const notifData = await notificationsAPI.getAll();
      setNotifications(notifData.notifications || []);
      setUnreadCount(notifData.unread_count || 0);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    localStorage.setItem('sih_auth_token', res.token);
    setUser(res.user);
    await fetchNotifications();
    return res.user;
  };

  const demoLogin = async (role) => {
    const res = await authAPI.demoLogin(role);
    localStorage.setItem('sih_auth_token', res.token);
    setUser(res.user);
    await fetchNotifications();
    return res.user;
  };

  const register = async (payload) => {
    const res = await authAPI.register(payload);
    localStorage.setItem('sih_auth_token', res.token);
    setUser(res.user);
    await fetchNotifications();
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('sih_auth_token');
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        demoLogin,
        register,
        logout,
        notifications,
        unreadCount,
        refreshNotifications: fetchNotifications,
        refreshUser: fetchUser,
      }}
    >
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
