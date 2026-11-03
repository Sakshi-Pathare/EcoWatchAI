import { initialMockCleanups } from '../data/mockCleanups';

const STORAGE_KEY = 'ecowatch_cleanups_v1';

function loadStoredCleanups() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockCleanups));
      return initialMockCleanups;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored cleanups', e);
    return initialMockCleanups;
  }
}

function saveStoredCleanups(cleanups) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanups));
  } catch (e) {
    console.error('Failed to save cleanups', e);
  }
}

export const cleanupService = {
  async getCleanups(status = 'all') {
    await new Promise((r) => setTimeout(r, 150));
    let cleanups = loadStoredCleanups();
    if (status !== 'all') {
      cleanups = cleanups.filter((c) => c.status === status);
    }
    return cleanups;
  },

  async updateTaskStatus(id, newStatus, afterImageUrl = null) {
    await new Promise((r) => setTimeout(r, 200));
    const cleanups = loadStoredCleanups();
    const index = cleanups.findIndex((c) => c.id === id);
    if (index !== -1) {
      cleanups[index] = {
        ...cleanups[index],
        status: newStatus,
        updatedAt: new Date().toISOString(),
        ...(newStatus === 'completed' ? {
          completedAt: new Date().toISOString(),
          afterImageUrl: afterImageUrl || cleanups[index].afterImageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        } : {}),
      };
      saveStoredCleanups(cleanups);
      return cleanups[index];
    }
    throw new Error('Cleanup task not found');
  },

  async assignTask(id, teamName, scheduledDate) {
    await new Promise((r) => setTimeout(r, 200));
    const cleanups = loadStoredCleanups();
    const index = cleanups.findIndex((c) => c.id === id);
    if (index !== -1) {
      cleanups[index] = {
        ...cleanups[index],
        assignedTeam: teamName,
        scheduledDate: scheduledDate,
        updatedAt: new Date().toISOString(),
      };
      saveStoredCleanups(cleanups);
      return cleanups[index];
    }
    throw new Error('Cleanup task not found');
  }
};

