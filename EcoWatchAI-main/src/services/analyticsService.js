import { request } from './apiClient.js';

export const analyticsService = {
  async getPublicDashboardMetrics() { return request('/public/metrics'); },
  async getDashboardMetrics() { return request('/analytics/metrics'); },
  async getPollutionTrends() { return request('/analytics/trends'); },
  async getCategoryBreakdown() { return request('/analytics/categories'); },
  async getWardStats() { return request('/admin/ward-stats'); },
  async getNotifications() { return request('/admin/notifications'); },
  async markNotificationRead(id) {
    return request(`/admin/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH' });
  },
};

