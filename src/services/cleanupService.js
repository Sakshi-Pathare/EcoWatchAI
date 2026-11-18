import { initialMockCleanups } from '../data/mockCleanups.js';
import { reportService } from './reportService.js';

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
    await new Promise((r) => setTimeout(r, 120));
    let cleanups = loadStoredCleanups();
    if (status !== 'all') {
      cleanups = cleanups.filter((c) => c.status === status);
    }
    return cleanups;
  },

  async updateTaskStatus(id, newStatus, afterImageUrl = null) {
    await new Promise((r) => setTimeout(r, 150));
    const cleanups = loadStoredCleanups();
    const index = cleanups.findIndex((c) => c.id === id);
    if (index !== -1) {
      const task = cleanups[index];
      cleanups[index] = {
        ...task,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        ...(newStatus === 'completed' ? {
          completedAt: new Date().toISOString(),
          afterImageUrl: afterImageUrl || task.afterImageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        } : {}),
      };
      saveStoredCleanups(cleanups);

      // Bi-directional state synchronization with reportService
      if (task.reportId) {
        try {
          if (newStatus === 'completed') {
            await reportService.updateReportStatus(task.reportId, 'cleaned');
          } else if (newStatus === 'in_progress') {
            await reportService.updateReportStatus(task.reportId, 'scheduled');
          }
        } catch (syncErr) {
          console.warn('Could not update linked report status', syncErr);
        }
      }

      return cleanups[index];
    }
    throw new Error('Cleanup task not found');
  },

  async assignTask(id, teamName, scheduledDate) {
    await new Promise((r) => setTimeout(r, 150));
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
  },

  async createTaskFromReport(report, assignedTeam = 'Metro Rapid Response - Squad A', scheduledDate = null) {
    await new Promise((r) => setTimeout(r, 150));
    const cleanups = loadStoredCleanups();

    // Check if task already exists for this report
    const existing = cleanups.find((c) => c.reportId === report.id);
    if (existing) {
      existing.status = 'pending';
      existing.assignedTeam = assignedTeam;
      existing.scheduledDate = scheduledDate || new Date(Date.now() + 86400000).toISOString();
      existing.updatedAt = new Date().toISOString();
      saveStoredCleanups(cleanups);
      return existing;
    }

    const newTask = {
      id: `CLN-${Math.floor(810 + Math.random() * 190)}`,
      reportId: report.id,
      taskName: `${report.title} Clearance`,
      location: report.address || 'Reported Location',
      assignedTeam: assignedTeam,
      contactLead: 'Operations Dispatch Lead',
      scheduledDate: scheduledDate || new Date(Date.now() + 86400000).toISOString(),
      status: 'pending',
      priority: report.severity || 'medium',
      estimatedHours: (report.estimatedKg || 5) > 20 ? 3.5 : 1.5,
      wasteVolumeEstimate: `${report.estimatedKg || 5} kg`,
      beforeImageUrl: report.imageUrl || null,
      afterImageUrl: null,
      notes: `Generated from incident report (${report.id}): ${report.description || 'Civic litter removal required.'}`,
      updatedAt: new Date().toISOString(),
    };

    const updated = [newTask, ...cleanups];
    saveStoredCleanups(updated);
    return newTask;
  }
};

