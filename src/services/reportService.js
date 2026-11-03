import { initialMockReports } from '../data/mockReports';

const STORAGE_KEY = 'ecowatch_reports_v1';

function loadStoredReports() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockReports));
      return initialMockReports;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored reports', e);
    return initialMockReports;
  }
}

function saveStoredReports(reports) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save reports to localStorage', e);
  }
}

export const reportService = {
  async getAllReports(filters = {}) {
    await new Promise((r) => setTimeout(r, 150));
    let reports = loadStoredReports();

    if (filters.severity && filters.severity !== 'all') {
      reports = reports.filter((r) => r.severity === filters.severity);
    }
    if (filters.status && filters.status !== 'all') {
      reports = reports.filter((r) => r.status === filters.status);
    }
    if (filters.category && filters.category !== 'all') {
      reports = reports.filter((r) => r.category === filters.category);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      reports = reports.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.address?.toLowerCase().includes(q)
      );
    }

    return reports;
  },

  async getReportById(id) {
    await new Promise((r) => setTimeout(r, 100));
    const reports = loadStoredReports();
    return reports.find((r) => r.id === id) || null;
  },

  async getUserReports(userId = 'usr_current') {
    await new Promise((r) => setTimeout(r, 150));
    const reports = loadStoredReports();
    return reports.filter((r) => r.reporterId === userId);
  },

  async createReport(reportData) {
    await new Promise((r) => setTimeout(r, 300));
    const reports = loadStoredReports();
    const newReport = {
      id: `REP-${Math.floor(2050 + Math.random() * 900)}`,
      title: reportData.title || 'Untitled Litter Submission',
      description: reportData.description || 'Litter reported via mobile/web client.',
      latitude: Number(reportData.latitude) || 37.7749,
      longitude: Number(reportData.longitude) || -122.4194,
      address: reportData.address || 'San Francisco, CA',
      category: reportData.category || 'mixed',
      severity: reportData.severity || 'medium',
      status: 'pending',
      reportedAt: new Date().toISOString(),
      reporterName: reportData.reporterName || 'Alex Mercer',
      reporterId: 'usr_current',
      estimatedKg: Number(reportData.estimatedKg) || 4.0,
      imageUrl: reportData.imageUrl || 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
      detectionNote: 'Uploaded report received. Awaiting backend YOLO object detection pipeline in Phase 2.',
    };

    const updated = [newReport, ...reports];
    saveStoredReports(updated);
    return newReport;
  },

  async updateReportStatus(id, newStatus) {
    await new Promise((r) => setTimeout(r, 200));
    const reports = loadStoredReports();
    const index = reports.findIndex((r) => r.id === id);
    if (index !== -1) {
      reports[index] = { ...reports[index], status: newStatus };
      saveStoredReports(reports);
      return reports[index];
    }
    throw new Error('Report not found');
  },

  async resetToDefaults() {
    saveStoredReports(initialMockReports);
    return initialMockReports;
  }
};

