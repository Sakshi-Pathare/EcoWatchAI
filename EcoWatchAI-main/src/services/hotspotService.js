import { request } from './apiClient.js';

export const hotspotService = {
  async getPublicHotspots(sortBy = 'priority') {
    return request(`/public/hotspots?sort_by=${encodeURIComponent(sortBy)}`);
  },

  async getHotspots(sortBy = 'priority') {
    return request(`/hotspots?sort_by=${encodeURIComponent(sortBy)}`);
  },

  async getHotspotById(id) {
    return request(`/hotspots/${encodeURIComponent(id)}`);
  }
};

