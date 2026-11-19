import { request, setAuthToken } from './apiClient.js';

export const authService = {
  async login(email, password) {
    const result = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(result.accessToken);
    return result.user;
  },

  async register(user) {
    const result = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    setAuthToken(result.accessToken);
    return result.user;
  },

  async getCurrentUser() {
    return request('/auth/me');
  },

  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      setAuthToken(null);
    }
  },
};
