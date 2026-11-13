import { initialMockReports } from '../data/mockReports.js';
import {
  saveImageToIndexedDB,
  getImageFromIndexedDB,
  deleteImageFromIndexedDB,
} from '../utils/imageStorage.js';

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
    console.warn('localStorage write failed, applying quota preservation fallback', e);
    // If quota exceeded, strip large Data URLs from localStorage copy since IndexedDB preserves them
    try {
      const quotaSafeReports = reports.map((r) => {
        if (r.imageUrl && r.imageUrl.startsWith('data:') && r.imageUrl.length > 30000) {
          return { ...r, imageUrl: '' }; // Kept in IndexedDB
        }
        return r;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quotaSafeReports));
    } catch (fallbackError) {
      console.error('Critical quota error in localStorage', fallbackError);
    }
  }
}

export const reportService = {
  async getAllReports(filters = {}) {
    await new Promise((r) => setTimeout(r, 120));
    let reports = loadStoredReports();

    // Asynchronously enrich any reports missing their full image from IndexedDB
    const enriched = await Promise.all(
      reports.map(async (r) => {
        if (!r.imageUrl) {
          const storedImg = await getImageFromIndexedDB(r.id);
          if (storedImg) return { ...r, imageUrl: storedImg };
        }
        return r;
      })
    );
    reports = enriched;

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
          r.address?.toLowerCase().includes(q) ||
          r.id?.toLowerCase().includes(q)
      );
    }

    return reports;
  },

  async getReportById(id) {
    await new Promise((r) => setTimeout(r, 80));
    const reports = loadStoredReports();
    const report = reports.find((r) => r.id === id);
    if (!report) return null;

    if (!report.imageUrl) {
      const storedImg = await getImageFromIndexedDB(report.id);
      if (storedImg) {
        return { ...report, imageUrl: storedImg };
      }
    }
    return report;
  },

  async getUserReports(userId = 'usr_current') {
    await new Promise((r) => setTimeout(r, 120));
    const all = await this.getAllReports();
    return all.filter((r) => r.reporterId === userId);
  },

  async createReport(reportData) {
    await new Promise((r) => setTimeout(r, 200));
    const reports = loadStoredReports();
    const reportId = `REP-${Math.floor(2050 + Math.random() * 900)}`;

    const newReport = {
      id: reportId,
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
      detectionNote: 'Uploaded report received. Verified via client-side intake pipeline.',
    };

    // Store high-res photo in IndexedDB if it is a Data URL
    if (newReport.imageUrl && newReport.imageUrl.startsWith('data:')) {
      await saveImageToIndexedDB(reportId, newReport.imageUrl);
    }

    const updated = [newReport, ...reports];
    saveStoredReports(updated);
    return newReport;
  },

  async updateReportStatus(id, newStatus) {
    await new Promise((r) => setTimeout(r, 150));
    const reports = loadStoredReports();
    const index = reports.findIndex((r) => r.id === id);
    if (index !== -1) {
      reports[index] = { ...reports[index], status: newStatus };
      saveStoredReports(reports);
      return reports[index];
    }
    throw new Error('Report not found');
  },

  async deleteReport(id) {
    await new Promise((r) => setTimeout(r, 150));
    const reports = loadStoredReports();
    const filtered = reports.filter((r) => r.id !== id);
    if (filtered.length === reports.length) {
      throw new Error(`Report ${id} not found.`);
    }
    saveStoredReports(filtered);
    await deleteImageFromIndexedDB(id);
    return true;
  },

  async resetToDefaults() {
    saveStoredReports(initialMockReports);
    return initialMockReports;
  }
};

