import React, { useCallback, useEffect, useState } from 'react';
import { Building2, ClipboardList, MapPinned, ShieldPlus } from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Card, CardBody, CardHeader } from '../components/common/Card.jsx';
import { superAdminService } from '../services/superAdminService.js';

export function SuperAdminPage() {
  const [municipalities, setMunicipalities] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);
  const [audit, setAudit] = useState([]);
  const [municipalityForm, setMunicipalityForm] = useState({
    code: '',
    name: '',
    boundarySource: '',
    boundaryGeojson: '',
    wardBoundaries: '',
  });
  const [adminForm, setAdminForm] = useState({
    municipalityCode: '',
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [resolutions, setResolutions] = useState({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [registeredMunicipalities, unassignedReports, auditRows] = await Promise.all([
        superAdminService.getMunicipalities(),
        superAdminService.getPendingReports(),
        superAdminService.getAuditLog(),
      ]);
      setMunicipalities(registeredMunicipalities);
      setPendingReports(unassignedReports);
      setAudit(auditRows);
      setAdminForm((previous) => ({
        ...previous,
        municipalityCode: previous.municipalityCode || registeredMunicipalities[0]?.code || '',
      }));
      setResolutions((previous) => {
        const next = { ...previous };
        unassignedReports.forEach((report) => {
          if (!next[report.id]) {
            next[report.id] = {
              municipalityCode: registeredMunicipalities[0]?.code || '',
              reason: '',
            };
          }
        });
        return next;
      });
    } catch (loadError) {
      setError(loadError.message || 'Unable to load platform administration data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreateMunicipality = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      let boundaryGeojson;
      try {
        boundaryGeojson = JSON.parse(municipalityForm.boundaryGeojson);
      } catch {
        throw new Error('Boundary must be valid GeoJSON JSON.');
      }
      let wardBoundaries = [];
      if (municipalityForm.wardBoundaries.trim()) {
        try {
          wardBoundaries = JSON.parse(municipalityForm.wardBoundaries);
        } catch {
          throw new Error('Ward boundaries must be valid JSON containing an array.');
        }
        if (!Array.isArray(wardBoundaries)) {
          throw new Error('Ward boundaries must be a JSON array.');
        }
      }
      await superAdminService.createMunicipality({
        ...municipalityForm,
        boundaryGeojson,
        wardBoundaries,
      });
      setNotice('Municipality and boundary registered.');
      setMunicipalityForm({ code: '', name: '', boundarySource: '', boundaryGeojson: '', wardBoundaries: '' });
      await loadData();
    } catch (submitError) {
      setError(submitError.message || 'Unable to register municipality.');
    } finally {
      setBusy(false);
    }
  };

  const handleCreateAdmin = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const payload = {
        ...adminForm,
        authorizedWardIds: adminForm.authorizedWardIds
          ? adminForm.authorizedWardIds.split(',').map((item) => item.trim()).filter(Boolean)
          : null,
        authorizedZoneIds: adminForm.authorizedZoneIds
          ? adminForm.authorizedZoneIds.split(',').map((item) => item.trim()).filter(Boolean)
          : null,
      };
      await superAdminService.createMunicipalAdmin(payload);
      setNotice(`Municipal administrator created for ${adminForm.municipalityCode}.`);
      setAdminForm((previous) => ({ ...previous, name: '', email: '', phone: '', password: '' }));
    } catch (submitError) {
      setError(submitError.message || 'Unable to create municipal administrator.');
    } finally {
      setBusy(false);
    }
  };

  const handleResolve = async (report) => {
    const resolution = resolutions[report.id];
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await superAdminService.resolveReportJurisdiction(
        report.id,
        resolution?.municipalityCode,
        resolution?.reason || ''
      );
      setNotice(`Report ${report.id} assigned and routed.`);
      await loadData();
    } catch (submitError) {
      setError(submitError.message || 'Unable to resolve report jurisdiction.');
    } finally {
      setBusy(false);
    }
  };

  const setResolution = (reportId, field, value) => {
    setResolutions((previous) => ({
      ...previous,
      [reportId]: { ...previous[reportId], [field]: value },
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      <header>
        <h1 className="text-3xl font-serif font-bold text-[#10241B]">Platform Administration</h1>
        <p className="mt-1 text-sm text-[#556E55]">Register verified jurisdiction boundaries, create municipal administrators, and route reports requiring review.</p>
      </header>

      {error && <div role="alert" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm">{error}</div>}
      {notice && <div role="status" className="p-4 rounded-xl bg-forest-50 border border-forest-200 text-forest-900 text-sm">{notice}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Register a municipality" subtitle="Use authoritative municipal boundary GeoJSON; sample coordinates are only placeholders." icon={Building2} />
          <CardBody>
            <form onSubmit={handleCreateMunicipality} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input required minLength={2} maxLength={32} placeholder="Code (e.g. PMC)" value={municipalityForm.code} onChange={(event) => setMunicipalityForm({ ...municipalityForm, code: event.target.value })} className="rounded-lg border border-sage-300 px-3 py-2 text-sm" />
                <input required minLength={2} maxLength={180} placeholder="Municipality name" value={municipalityForm.name} onChange={(event) => setMunicipalityForm({ ...municipalityForm, name: event.target.value })} className="rounded-lg border border-sage-300 px-3 py-2 text-sm" />
              </div>
              <input required minLength={3} maxLength={500} placeholder="Boundary source URL / authority / version" value={municipalityForm.boundarySource} onChange={(event) => setMunicipalityForm({ ...municipalityForm, boundarySource: event.target.value })} className="w-full rounded-lg border border-sage-300 px-3 py-2 text-sm" />
              <textarea required rows={7} value={municipalityForm.boundaryGeojson} onChange={(event) => setMunicipalityForm({ ...municipalityForm, boundaryGeojson: event.target.value })} className="w-full rounded-lg border border-sage-300 px-3 py-2 font-mono text-xs" aria-label="Municipality GeoJSON boundary" placeholder='{"type":"Polygon","coordinates":[...]}' />
              <textarea rows={5} value={municipalityForm.wardBoundaries} onChange={(event) => setMunicipalityForm({ ...municipalityForm, wardBoundaries: event.target.value })} className="w-full rounded-lg border border-sage-300 px-3 py-2 font-mono text-xs" aria-label="Optional ward boundaries" placeholder='Optional ward GeoJSON array: [{"wardId":"W-1","zoneId":"Z-1","geometry":{"type":"Polygon","coordinates":[...]}}]' />
              <Button type="submit" icon={MapPinned} loading={busy}>Register boundary</Button>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Create municipal administrator" subtitle="New administrators are scoped to one registered municipality." icon={ShieldPlus} />
          <CardBody>
            <form onSubmit={handleCreateAdmin} className="space-y-3">
              <select required value={adminForm.municipalityCode} onChange={(event) => setAdminForm({ ...adminForm, municipalityCode: event.target.value })} className="w-full rounded-lg border border-sage-300 px-3 py-2 text-sm">
                <option value="">Select municipality</option>
                {municipalities.map((municipality) => <option key={municipality.code} value={municipality.code}>{municipality.name} ({municipality.code})</option>)}
              </select>
              <input required minLength={2} maxLength={120} placeholder="Administrator name" value={adminForm.name} onChange={(event) => setAdminForm({ ...adminForm, name: event.target.value })} className="w-full rounded-lg border border-sage-300 px-3 py-2 text-sm" />
              <input required type="email" maxLength={254} placeholder="Email" value={adminForm.email} onChange={(event) => setAdminForm({ ...adminForm, email: event.target.value })} className="w-full rounded-lg border border-sage-300 px-3 py-2 text-sm" />
              <input maxLength={40} placeholder="Phone (optional)" value={adminForm.phone} onChange={(event) => setAdminForm({ ...adminForm, phone: event.target.value })} className="w-full rounded-lg border border-sage-300 px-3 py-2 text-sm" />
              <input placeholder="Authorized ward IDs, comma-separated (blank = all)" value={adminForm.authorizedWardIds || ''} onChange={(event) => setAdminForm({ ...adminForm, authorizedWardIds: event.target.value })} className="w-full rounded-lg border border-sage-300 px-3 py-2 text-sm" />
              <input placeholder="Authorized zone IDs, comma-separated (blank = all)" value={adminForm.authorizedZoneIds || ''} onChange={(event) => setAdminForm({ ...adminForm, authorizedZoneIds: event.target.value })} className="w-full rounded-lg border border-sage-300 px-3 py-2 text-sm" />
              <input required type="password" minLength={12} maxLength={128} placeholder="Temporary password (minimum 12 characters)" value={adminForm.password} onChange={(event) => setAdminForm({ ...adminForm, password: event.target.value })} className="w-full rounded-lg border border-sage-300 px-3 py-2 text-sm" />
              <Button type="submit" icon={ShieldPlus} loading={busy} disabled={!municipalities.length}>Create administrator</Button>
            </form>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title={`Reports awaiting jurisdiction review (${pendingReports.length})`} subtitle="Reports remain private and excluded from public maps until assigned." icon={ClipboardList} action={<Button variant="outline" size="sm" onClick={loadData} loading={loading}>Refresh</Button>} />
        <CardBody className="space-y-4">
          {!loading && pendingReports.length === 0 && <p className="text-sm text-charcoal-600">No reports are currently awaiting jurisdiction review.</p>}
          {pendingReports.map((report) => (
            <div key={report.id} className="rounded-xl border border-sage-200 p-4 space-y-3">
              <div>
                <h3 className="font-bold text-sm">{report.title} <span className="font-mono text-xs text-charcoal-500">{report.id}</span></h3>
                <p className="text-xs text-charcoal-600 mt-1">{report.address || 'No address'} · {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}</p>
                <p className="text-xs text-charcoal-600 mt-1">Citizen: {report.reporterName || 'Unknown'}{report.reporterEmail ? ` · ${report.reporterEmail}` : ''}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_2fr_auto]">
                <select required value={resolutions[report.id]?.municipalityCode || ''} onChange={(event) => setResolution(report.id, 'municipalityCode', event.target.value)} className="rounded-lg border border-sage-300 px-3 py-2 text-sm">
                  <option value="">Select municipality</option>
                  {municipalities.filter((item) => item.boundaryAvailable && item.active).map((municipality) => <option key={municipality.code} value={municipality.code}>{municipality.name} ({municipality.code})</option>)}
                </select>
                <input required minLength={10} maxLength={1000} placeholder="Reason for manual assignment (at least 10 characters)" value={resolutions[report.id]?.reason || ''} onChange={(event) => setResolution(report.id, 'reason', event.target.value)} className="rounded-lg border border-sage-300 px-3 py-2 text-sm" />
                <Button type="button" size="sm" disabled={busy || !municipalities.some((item) => item.boundaryAvailable && item.active)} onClick={() => handleResolve(report)}>Assign</Button>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Recent platform audit events" subtitle={`${audit.length} latest events`} icon={ClipboardList} />
        <CardBody>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {audit.map((entry) => (
              <div key={entry.id} className="flex flex-wrap justify-between gap-2 border-b border-sage-100 py-2 text-xs">
                <span className="font-semibold">{entry.action}{entry.reportId ? ` · ${entry.reportId}` : ''}</span>
                <span className="text-charcoal-500">{entry.createdAt ? new Date(entry.createdAt).toLocaleString() : ''}</span>
              </div>
            ))}
            {!loading && audit.length === 0 && <p className="text-sm text-charcoal-600">No audit entries yet.</p>}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
