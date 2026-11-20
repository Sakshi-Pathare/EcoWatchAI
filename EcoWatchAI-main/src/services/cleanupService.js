import { request } from './apiClient.js';

export const cleanupService = {
  async getCleanups(status = 'all') {
    return request(`/cleanups?status=${encodeURIComponent(status)}`);
  },

  async updateTaskStatus(id, newStatus, afterImageUrl = null) {
    return request(`/cleanups/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus, afterImageUrl }),
    });
  },

  async assignTask(id, teamName, scheduledDate) {
    return request(`/cleanups/${encodeURIComponent(id)}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ assignedTeam: teamName, scheduledDate }),
    });
  },

  async createTaskFromReport(report, assignedTeam = 'Metro Rapid Response - Squad A', scheduledDate = null) {
    return request('/cleanups', {
      method: 'POST',
      body: JSON.stringify({
        reportId: report.id,
        assignedTeam,
        scheduledDate,
      }),
    });
  }
};

