import { request } from './apiClient.js';

export const superAdminService = {
  getMunicipalities: () => request('/superadmin/municipalities'),
  getPendingReports: () => request('/superadmin/reports/pending-jurisdiction'),
  getAuditLog: () => request('/superadmin/audit'),
  createMunicipality: (payload) => request('/superadmin/municipalities', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  createMunicipalAdmin: (payload) => request('/superadmin/admins', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  resolveReportJurisdiction: (reportId, municipalityCode, reason) => request(
    `/superadmin/reports/${encodeURIComponent(reportId)}/jurisdiction`,
    {
      method: 'POST',
      body: JSON.stringify({ municipalityCode, reason }),
    }
  ),
};
