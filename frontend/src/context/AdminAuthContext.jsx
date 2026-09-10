import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import api from '../services/api';

const AdminAuthContext = createContext(null);
const ADMIN_TOKEN_KEY = 'pharma_admin_token';

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const raw = localStorage.getItem('pharma_admin_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/api/auth/admin/login', { email, password }, { skipAuth: true });
    localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    localStorage.setItem('pharma_admin_user', JSON.stringify(data.user));
    setAdmin(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem('pharma_admin_user');
    setAdmin(null);
  }, []);

  const value = useMemo(() => ({ admin, login, logout }), [admin, login, logout]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}
