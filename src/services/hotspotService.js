import { initialMockHotspots } from '../data/mockHotspots.js';

const STORAGE_KEY = 'vasundhara_hotspots_v2_mh';

function loadStoredHotspots() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockHotspots));
      return initialMockHotspots;
    }
    const parsed = JSON.parse(raw);
    // If old cached data is from foreign coordinates (e.g. lat > 30 or lng < 0), auto-migrate to Maharashtra India
    if (Array.isArray(parsed) && parsed.some(h => h.latitude > 30 || h.longitude < 0)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockHotspots));
      return initialMockHotspots;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to parse stored hotspots', e);
    return initialMockHotspots;
  }
}

function saveStoredHotspots(hotspots) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hotspots));
  } catch (e) {
    console.error('Failed to save hotspots to localStorage', e);
  }
}

export const hotspotService = {
  async getHotspots(sortBy = 'priority') {
    await new Promise((r) => setTimeout(r, 100));
    const hotspots = loadStoredHotspots();

    return [...hotspots].sort((a, b) => {
      if (sortBy === 'priority') return b.priorityScore - a.priorityScore;
      if (sortBy === 'recurrence') return b.recurrenceCount - a.recurrenceCount;
      if (sortBy === 'date') return new Date(b.lastReportedDate) - new Date(a.lastReportedDate);
      return 0;
    });
  },

  async getHotspotById(id) {
    await new Promise((r) => setTimeout(r, 80));
    const hotspots = loadStoredHotspots();
    return hotspots.find((h) => h.id === id) || null;
  },

  async createHotspot(data) {
    await new Promise((r) => setTimeout(r, 100));
    const hotspots = loadStoredHotspots();
    const newId = `HOT-${String(hotspots.length + 1).padStart(2, '0')}`;

    const newHotspot = {
      id: newId,
      name: data.name || 'Custom Environmental Hotspot',
      district: data.district || 'Municipal Sector',
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      radiusMeters: Number(data.radiusMeters) || 200,
      recurrenceCount: Number(data.recurrenceCount) || 10,
      severity: data.severity || 'high',
      priorityScore: Number(data.priorityScore) || 85,
      dominantCategory: data.dominantCategory || 'plastic',
      lastReportedDate: new Date().toISOString(),
      trend: data.trend || '+12% this month',
      environmentalRisk: data.environmentalRisk || 'Identified repetitive public pollution accumulation',
      suggestedAction: data.suggestedAction || 'Sanitation dispatch and monitoring sensor placement',
    };

    const updated = [newHotspot, ...hotspots];
    saveStoredHotspots(updated);
    return newHotspot;
  },

  async deleteHotspot(id) {
    await new Promise((r) => setTimeout(r, 80));
    const hotspots = loadStoredHotspots();
    const filtered = hotspots.filter((h) => h.id !== id);
    saveStoredHotspots(filtered);
    return filtered;
  },

  async loadPreset(presetList) {
    saveStoredHotspots(presetList);
    return presetList;
  },

  async resetToDefault() {
    saveStoredHotspots(initialMockHotspots);
    return initialMockHotspots;
  }
};

