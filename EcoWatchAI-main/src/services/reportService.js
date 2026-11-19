import { request } from './apiClient.js';

export const reportService = {
  async getPublicReports(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') params.set(key, value);
    });
    const query = params.toString();
    return request(`/public/reports${query ? `?${query}` : ''}`);
  },

  async getAdminReports(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') params.set(key, value);
    });
    const query = params.toString();
    return request(`/reports${query ? `?${query}` : ''}`);
  },

  async getReportById(id) {
    return request(`/reports/${encodeURIComponent(id)}`);
  },

  async getUserReports() {
    return request('/reports/mine');
  },

  async createReport(reportData) {
    return request('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  },

  async updateReportStatus(id, newStatus) {
    return request(`/reports/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });
  },

  async deleteReport(id) {
    await request(`/reports/${encodeURIComponent(id)}`, { method: 'DELETE' });
    return true;
  },
};

