export const mockPollutionTrends = [
  { month: "May", reports: 42, resolved: 38, hotspotAlerts: 4 },
  { month: "Jun", reports: 58, resolved: 50, hotspotAlerts: 6 },
  { month: "Jul", reports: 74, resolved: 65, hotspotAlerts: 9 },
  { month: "Aug", reports: 86, resolved: 79, hotspotAlerts: 11 },
  { month: "Sep", reports: 69, resolved: 64, hotspotAlerts: 7 },
  { month: "Oct", reports: 92, resolved: 81, hotspotAlerts: 14 },
  { month: "Nov (Est)", reports: 48, resolved: 36, hotspotAlerts: 6 },
];

export const mockCategoryBreakdown = [
  { name: "Plastics & Packaging", value: 38, color: "#184730" }, // Forest
  { name: "Mixed Public Litter", value: 24, color: "#758F71" }, // Sage
  { name: "Glass & Bottles", value: 16, color: "#059669" }, // Emerald
  { name: "Paper & Cardboard", value: 12, color: "#94AC90" }, // Light Sage
  { name: "Hazardous & E-Waste", value: 6, color: "#E11D48" }, // Crimson
  { name: "Metals & Scrap", value: 4, color: "#D97706" }, // Amber
];

export const mockImpactMetrics = {
  totalReportsLogged: 469,
  verifiedIncidents: 421,
  pendingReview: 18,
  activeCleanupTasks: 12,
  completedCleanups: 391,
  totalWasteCollectedKg: 4280,
  averageResponseTimeHours: 19.4,
  activeHotspotsTracked: 6,
  communityVolunteers: 184,
  civicSatisfactionScore: 94.2, // %
};

