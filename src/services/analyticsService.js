import { mockPollutionTrends, mockCategoryBreakdown, mockImpactMetrics } from '../data/mockAnalytics.js';
import { reportService } from './reportService.js';

export const analyticsService = {
  async getDashboardMetrics() {
    await new Promise((r) => setTimeout(r, 150));
    const reports = await reportService.getAllReports();

    const pending = reports.filter((r) => r.status === 'pending').length;
    const verified = reports.filter((r) => r.status === 'verified').length;
    const scheduled = reports.filter((r) => r.status === 'scheduled').length;
    const cleaned = reports.filter((r) => r.status === 'cleaned').length;

    return {
      totalReports: reports.length,
      pendingReports: pending,
      verifiedReports: verified,
      scheduledCleanups: scheduled,
      completedCleanups: cleaned,
      ...mockImpactMetrics,
    };
  },

  async getPollutionTrends() {
    await new Promise((r) => setTimeout(r, 100));
    return mockPollutionTrends;
  },

  async getCategoryBreakdown() {
    await new Promise((r) => setTimeout(r, 100));
    return mockCategoryBreakdown;
  }
};

