import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

/**
 * 認證Context
 * 管理用戶登入狀態和相關方法
 */
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth必須在AuthProvider內使用');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 組件掛載時檢查是否已登入
  useEffect(() => {
    checkAuth();
  }, []);
  
  /**
   * 檢查認證狀態
   */
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await authAPI.getMe();
      setUser(response.data.user);
    } catch (err) {
      console.error('認證檢查失敗:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * 登入
   */
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      
      // 儲存令牌和用戶資料
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      
      return { success: true };
    } catch (err) {
      setError(err.message || '登入失敗');
      return { success: false, error: err.message };
    }
  };
  
  /**
   * 註冊
   */
  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      
      // 註冊成功後自動登入
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      
      return { success: true };
    } catch (err) {
      setError(err.message || '註冊失敗');
      return { success: false, error: err.message };
    }
  };
  
  /**
   * 登出
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };
  
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
