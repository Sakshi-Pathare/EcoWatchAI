import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Flame,
  ArrowRight,
  BarChart3,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  MapPin,
  Activity,
  Sparkles,
  Radio,
  Trash2,
  Bell,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Button } from '../components/common/Button';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { StatWidget } from '../components/common/StatWidget';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { analyticsService } from '../services/analyticsService';
import { reportService } from '../services/reportService';
import { hotspotService } from '../services/hotspotService';
import { cleanupService } from '../services/cleanupService';
import { getSeverityBadgeProps, getStatusBadgeProps, getCategoryLabel } from '../utils/formatters';
import { formatDate } from '../utils/dateUtils';

export function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [trends, setTrends] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [wardStats, setWardStats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [m, t, c, r, h, wards, inbox] = await Promise.all([
        analyticsService.getDashboardMetrics(),
        analyticsService.getPollutionTrends(),
        analyticsService.getCategoryBreakdown(),
        reportService.getAdminReports(),
        hotspotService.getHotspots('priority'),
        analyticsService.getWardStats(),
        analyticsService.getNotifications(),
      ]);
      setMetrics(m);
      setTrends(t);
      setCategories(c);
      setRecentReports(r);
      setHotspots(h);
      setWardStats(wards);
      setNotifications(inbox);
    } catch (e) {
      setLoadError(e.message || 'Unable to load the municipal dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (reportId) => {
    setActionError('');
    try {
      await reportService.updateReportStatus(reportId, 'verified');
      setActionSuccess(`Report ${reportId} marked as Verified.`);
      loadAllData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (e) {
      setActionError(e.message || 'Unable to verify this report.');
    }
  };

  const handleScheduleCleanup = async (reportId) => {
    setActionError('');
    try {
      const updated = await reportService.updateReportStatus(reportId, 'scheduled');
      await cleanupService.createTaskFromReport(updated);
      setActionSuccess(`Report ${reportId} dispatched for scheduled sanitation.`);
      loadAllData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (e) {
      setActionError(e.message || 'Unable to schedule cleanup for this report.');
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm(`Are you sure you want to permanently remove report ${reportId}?`)) {
      return;
    }
    setActionError('');
    try {
      await reportService.deleteReport(reportId);
      setActionSuccess(`Report ${reportId} deleted successfully.`);
      loadAllData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (e) {
      setActionError(e.message || 'Unable to delete this report.');
    }
  };

  const handleMarkRead = async (notificationId) => {
    setActionError('');
    try {
      await analyticsService.markNotificationRead(notificationId);
      setNotifications((current) => current.map((item) => item.id === notificationId
        ? { ...item, readAt: new Date().toISOString() }
        : item));
    } catch (e) {
      setActionError(e.message || 'Unable to update this notification.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#1B4332]/10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#DEF5F1] text-[#092421] mb-2 border border-[#98E0D5] shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1B4A45]" />
            <span>Municipal Sanitation Command Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#10241B] tracking-tight">
            City Environmental Intelligence Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#556E55] mt-1 max-w-xl font-medium">
            Supervise incoming litter reports, verify photographic evidence, monitor algorithmic recurrence corridors, and dispatch sanitation squads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadAllData} className="shadow-xs font-bold rounded-full px-4 py-2">
            Refresh Telemetry
          </Button>
          <Link to="/hotspots">
            <Button variant="pista" size="sm" icon={Flame} glow className="shadow-lg font-black rounded-full px-4 py-2">
              Hotspot Hub
            </Button>
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 text-forest-900 text-xs font-bold flex items-center gap-2.5 shadow-soft animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-forest-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {loadError && (
        <div role="alert" className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-center justify-between gap-3">
          <span>{loadError}</span>
          <Button variant="outline" size="sm" onClick={loadAllData}>Retry</Button>
        </div>
      )}
      {actionError && <div role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm">{actionError}</div>}

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatWidget
          title="Total Reports Logged"
          value={metrics?.totalReports || 0}
          subtext="City-wide public submissions"
          icon={BarChart3}
          colorScheme="forest"
        />
        <StatWidget
          title="Pending Municipal Review"
          value={metrics?.pendingReports || 0}
          subtext="Awaiting officer verification"
          icon={Clock}
          colorScheme="amber"
        />
        <StatWidget
          title="Verified & Active"
          value={metrics?.verifiedReports || 0}
          subtext="Confirmed photographic evidence"
          icon={ShieldCheck}
          colorScheme="blue"
        />
        <StatWidget
          title="Completed Cleanups"
          value={metrics?.completedCleanups || 0}
          subtext="Sites cleared and certified"
          icon={CheckCircle}
          colorScheme="forest"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Chart: Pollution & Resolution Trends */}
        <div className="lg:col-span-8">
          <Card className="border-sage-200/90 shadow-soft">
            <CardHeader
              title="Pollution Incidence & Resolution Trajectory"
              subtitle="Six-month report submissions compared with reports marked cleaned"
              icon={Activity}
            />
            <CardBody>
              <div className="h-80 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#092421" stopOpacity={0.85} />
                        <stop offset="95%" stopColor="#092421" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#74D7CB" stopOpacity={0.85} />
                        <stop offset="95%" stopColor="#74D7CB" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DFD5C4" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#597057', fontWeight: 600 }} />
                    <YAxis tick={{ fontSize: 11, fill: '#597057', fontWeight: 600 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FAF8F5',
                        borderColor: '#DFD5C4',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        boxShadow: '0 10px 25px -5px rgba(9,36,33,0.1)',
                        fontWeight: 600,
                        color: '#092421',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="reports"
                      name="Reports Logged"
                      stroke="#092421"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorReports)"
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved"
                      name="Cleaned Sites"
                      stroke="#74D7CB"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorResolved)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-beige-200 text-xs font-bold text-darkgreen-950">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-[#092421] shadow-xs" />
                  <span>Public Litter Reports Logged</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-[#74D7CB] shadow-xs" />
                  <span>Reports Marked Cleaned</span>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader title="Ward-level activity" subtitle="Counts reflect only wards within your authorized scope." icon={MapPin} />
                    <CardBody>
                      {wardStats.length ? (
                        <div className="space-y-2">
                          {wardStats.map((ward) => (
                            <div key={ward.wardId} className="flex items-center justify-between gap-3 border-b border-sage-100 py-2 text-sm">
                              <span className="font-semibold">{ward.wardId}</span>
                              <span className="text-right text-xs text-charcoal-600">
                                {ward.totalReports} reports · {ward.pendingReports} pending · {ward.cleanedReports} cleaned
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-sm text-charcoal-600">No reports in the wards currently assigned to this account.</p>}
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader title="Municipal notifications" subtitle="Private inbox for reports routed to your account." icon={Bell} />
                    <CardBody>
                      {notifications.length ? (
                        <div className="space-y-3">
                          {notifications.slice(0, 8).map((notification) => (
                            <div key={notification.id} className="flex items-start justify-between gap-3 border-b border-sage-100 pb-3">
                              <div>
                                <p className="text-sm font-semibold">{notification.message}</p>
                                <p className="mt-1 text-xs text-charcoal-500">{formatDate(notification.createdAt)}</p>
                              </div>
                              {!notification.readAt && (
                                <Button variant="outline" size="xs" onClick={() => handleMarkRead(notification.id)}>Mark read</Button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-sm text-charcoal-600">No notifications.</p>}
                    </CardBody>
                  </Card>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Chart: Waste Material Distribution */}
        <div className="lg:col-span-4">
          <Card className="border-sage-200/90 shadow-soft">
            <CardHeader
              title="Material Composition"
              subtitle="Dominant waste types detected"
              icon={BarChart3}
            />
            <CardBody>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => `${val}%`}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#CBDBC9',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                        fontWeight: 600,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-sage-100 text-[11px]">
                {categories.map((c) => (
                  <div key={c.name} className="flex items-center gap-1.5 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: c.color }} />
                    <span className="truncate text-charcoal-600">{c.name}:</span>
                    <span className="font-extrabold text-charcoal-900 font-mono">{Math.round(c.value)}%</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Two Column Section: Recent Reports for Action & Hotspot Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Reports Action Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-charcoal-900">Incoming Submissions (Action Queue)</h2>
            <Link to="/map" className="text-xs text-forest-800 hover:text-forest-950 font-bold flex items-center gap-1">
              Inspect on GIS map <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="border-beige-300/90 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-beige-200/80 text-darkgreen-950 font-bold border-b border-beige-300">
                  <tr>
                    <th className="py-3.5 px-4">Incident</th>
                    <th className="py-3.5 px-4">Severity</th>
                    <th className="py-3.5 px-4">Material</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige-200/80">
                  {recentReports.slice(0, 5).map((r) => {
                    const sevProps = getSeverityBadgeProps(r.severity);
                    const statProps = getStatusBadgeProps(r.status);

                    return (
                      <tr key={r.id} className="hover:bg-beige-100/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-charcoal-900">{r.title}</div>
                          <div className="text-[11px] text-charcoal-500 truncate max-w-xs">{r.address}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${sevProps.bg}`}>
                            {sevProps.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-charcoal-800 font-semibold whitespace-nowrap">
                          {getCategoryLabel(r.category)}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statProps.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statProps.dot}`} />
                            {statProps.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                          {r.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="xs"
                              className="font-bold py-1 px-2.5"
                              onClick={() => handleVerify(r.id)}
                            >
                              Verify
                            </Button>
                          )}
                          {r.status !== 'cleaned' && r.status !== 'scheduled' && (
                            <Button
                              variant="primary"
                              size="xs"
                              className="font-bold py-1 px-2.5"
                              onClick={() => handleScheduleCleanup(r.id)}
                            >
                              Schedule
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="xs"
                            className="font-bold py-1 px-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                            onClick={() => handleDeleteReport(r.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right: Hotspots Summary Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-charcoal-900">Priority Hotspots</h2>
            <Link to="/hotspots" className="text-xs text-forest-800 hover:text-forest-950 font-bold flex items-center gap-1">
              Full List <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {hotspots.slice(0, 3).map((hotspot) => (
              <Card key={hotspot.id} className="p-4 border-l-4 border-l-rose-500 shadow-soft hover:shadow-soft-md transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-xs text-charcoal-900">{hotspot.name}</h4>
                    <p className="text-[11px] text-charcoal-500 font-medium">{hotspot.district}</p>
                  </div>
                  <span className="text-xs font-mono font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    {hotspot.priorityScore}/100
                  </span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-sage-100 flex items-center justify-between text-[11px] text-charcoal-600 font-medium">
                  <span>Recurrence: <b className="font-mono text-charcoal-900">{hotspot.recurrenceCount} times</b></span>
                  <span className="text-rose-700 font-bold">{hotspot.trend}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-forest-50 text-forest-900 space-y-2 border border-forest-100">
            <h4 className="font-semibold text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              API-BACKED MUNICIPAL OPERATIONS
            </h4>
            <p className="text-[11px] text-charcoal-700 leading-relaxed">
              Reports and cleanup tasks are stored in the connected API database. Hotspots are derived from assigned reports within 300 meters; SQLite is the default and PostgreSQL can be configured with DATABASE_URL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
