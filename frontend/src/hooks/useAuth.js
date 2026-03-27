import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'https://tech-city-3j3r.onrender.com/api';
const TOKEN_KEY = 'admin_token';

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const login = useCallback(async (password) => {
    const res = await axios.post(`${API_BASE}/auth/login`, { password });
    const { token: newToken } = res.data;
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    return newToken;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  return {
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };
}
