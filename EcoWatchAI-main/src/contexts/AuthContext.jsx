import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getAuthToken, setAuthToken } from '../services/apiClient.js';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!getAuthToken()) {
      setLoading(false);
      return;
    }
    authService.getCurrentUser()
      .then(setUser)
      .catch((error) => {
        if (error.status === 401) {
          setAuthToken(null);
          setUser(null);
          return;
        }
        setLoadError(error.message || 'Unable to verify your sign-in session.');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const authenticatedUser = await authService.login(email, password);
    setLoadError('');
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const register = useCallback(async (details) => {
    const authenticatedUser = await authService.register(details);
    setLoadError('');
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setAuthToken(null);
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({ user, loading, loadError, login, register, logout }), [
    user,
    loading,
    loadError,
    login,
    register,
    logout,
  ]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
