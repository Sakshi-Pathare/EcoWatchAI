import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService, DEMO_PROFILES } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Hydrate user on mount
  useEffect(() => {
    let mounted = true;
    authService
      .getCurrentUser()
      .then((activeUser) => {
        if (!mounted) return;
        // Default to citizen demo if nothing exists yet, ensuring an effortless first-time experience
        if (!activeUser) {
          const defaultUser = DEMO_PROFILES.citizen;
          setUser(defaultUser);
          localStorage.setItem('vasundhara_current_user_v2', JSON.stringify(defaultUser));
        } else {
          setUser(activeUser);
        }
      })
      .catch((err) => {
        if (mounted) setLoadError(err.message || 'Unable to verify session.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email, password, remember = true) => {
    setLoadError('');
    const authenticated = await authService.login(email, password, remember);
    setUser(authenticated);
    return authenticated;
  }, []);

  const register = useCallback(async (data, remember = true) => {
    setLoadError('');
    const newUser = await authService.register(data, remember);
    setUser(newUser);
    return newUser;
  }, []);

  const quickDemoLogin = useCallback(async (roleKey) => {
    setLoadError('');
    const demo = await authService.loginDemo(roleKey);
    setUser(demo);
    return demo;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const requestPasswordReset = useCallback(async (email) => {
    return authService.requestPasswordReset(email);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      loadError,
      login,
      register,
      quickDemoLogin,
      logout,
      requestPasswordReset,
      demoProfiles: DEMO_PROFILES,
    }),
    [user, loading, loadError, login, register, quickDemoLogin, logout, requestPasswordReset]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be consumed within an <AuthProvider>');
  }
  return context;
}
