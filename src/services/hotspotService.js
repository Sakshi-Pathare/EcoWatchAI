import { initialMockHotspots } from '../data/mockHotspots';

const STORAGE_KEY = 'ecowatch_hotspots_v1';

function loadStoredHotspots() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockHotspots));
      return initialMockHotspots;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored hotspots', e);
    return initialMockHotspots;
  }
}

export const hotspotService = {
  async getHotspots(sortBy = 'priority') {
    await new Promise((r) => setTimeout(r, 150));
    const hotspots = loadStoredHotspots();

    return [...hotspots].sort((a, b) => {
      if (sortBy === 'priority') return b.priorityScore - a.priorityScore;
      if (sortBy === 'recurrence') return b.recurrenceCount - a.recurrenceCount;
      if (sortBy === 'date') return new Date(b.lastReportedDate) - new Date(a.lastReportedDate);
      return 0;
    });
  },

  async getHotspotById(id) {
    await new Promise((r) => setTimeout(r, 100));
    const hotspots = loadStoredHotspots();
    return hotspots.find((h) => h.id === id) || null;
  }
};

