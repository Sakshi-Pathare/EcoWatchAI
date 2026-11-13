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
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [m, t, c, r, h] = await Promise.all([
        analyticsService.getDashboardMetrics(),
        analyticsService.getPollutionTrends(),
        analyticsService.getCategoryBreakdown(),
        reportService.getAllReports(),
        hotspotService.getHotspots('priority'),
      ]);
      setMetrics(m);
      setTrends(t);
      setCategories(c);
      setRecentReports(r);
      setHotspots(h);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (reportId) => {
    try {
      await reportService.updateReportStatus(reportId, 'verified');
      setActionSuccess(`Report ${reportId} marked as Verified.`);
      loadAllData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleScheduleCleanup = async (reportId) => {
    try {
      const updated = await reportService.updateReportStatus(reportId, 'scheduled');
      await cleanupService.createTaskFromReport(updated);
      setActionSuccess(`Report ${reportId} dispatched for scheduled sanitation.`);
      loadAllData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm(`Are you sure you want to permanently remove report ${reportId}?`)) {
      return;
    }
    try {
      await reportService.deleteReport(reportId);
      setActionSuccess(`Report ${reportId} deleted successfully.`);
      loadAllData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-sage-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-forest-100 text-forest-800 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
            <span>Municipal Sanitation Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            City Environmental Intelligence Overview
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Supervise incoming litter reports, verify evidence, monitor algorithmic hotspots, and allocate cleanup squads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadAllData}>
            Refresh Metrics
          </Button>
          <Link to="/hotspots">
            <Button variant="primary" size="sm" icon={Flame} className="shadow-sm">
              Hotspot Intel Hub
            </Button>
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-forest-50 border border-forest-200 text-forest-800 text-xs font-medium flex items-center gap-2 shadow-soft">
          <CheckCircle className="w-4 h-4 text-forest-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatWidget
          title="Total Reports Logged"
          value={metrics?.totalReports || 0}
          subtext="City-wide public submissions"
          icon={BarChart3}
          colorScheme="forest"
          trend="+18% vs last cycle"
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
          trend="+32 sites"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Chart: Pollution & Resolution Trends */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader
              title="Pollution Incidence & Resolution Trajectory"
              subtitle="6-Month historical reports filed vs verified cleanups"
            />
            <CardBody>
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#184730" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#184730" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#84CC16" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#84CC16" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#CBDBC9',
                        borderRadius: '0.5rem',
                        fontSize: '11px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="reports"
                      name="Reports Logged"
                      stroke="#184730"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorReports)"
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved"
                      name="Cleaned Sites"
                      stroke="#65A30D"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorResolved)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center gap-6 mt-4 text-xs font-medium text-charcoal-600">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-forest" />
                  <span>Public Litter Reports Logged</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-limeaccent-600" />
                  <span>Verified Cleanups Completed</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Chart: Waste Material Distribution */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader
              title="Material Composition"
              subtitle="Dominant waste types detected"
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
                        borderRadius: '0.5rem',
                        fontSize: '11px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-sage-100 text-[11px]">
                {categories.map((c) => (
                  <div key={c.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="truncate text-charcoal-600">{c.name}:</span>
                    <span className="font-bold text-charcoal-900">{c.value}%</span>
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
            <Link to="/map" className="text-xs text-forest-700 hover:text-forest-900 font-semibold flex items-center gap-1">
              Inspect on GIS map <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-offwhite-200 text-charcoal-600 font-semibold border-b border-sage-200">
                  <tr>
                    <th className="py-3 px-4">Incident</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Material</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-100">
                  {recentReports.slice(0, 5).map((r) => {
                    const sevProps = getSeverityBadgeProps(r.severity);
                    const statProps = getStatusBadgeProps(r.status);

                    return (
                      <tr key={r.id} className="hover:bg-offwhite-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-charcoal-900">{r.title}</div>
                          <div className="text-[11px] text-charcoal-500 truncate max-w-xs">{r.address}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sevProps.bg}`}>
                            {sevProps.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-charcoal-700 font-medium whitespace-nowrap">
                          {getCategoryLabel(r.category)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${statProps.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statProps.dot}`} />
                            {statProps.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                          {r.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[11px] py-1 px-2"
                              onClick={() => handleVerify(r.id)}
                            >
                              Verify
                            </Button>
                          )}
                          {r.status !== 'cleaned' && r.status !== 'scheduled' && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="text-[11px] py-1 px-2"
                              onClick={() => handleScheduleCleanup(r.id)}
                            >
                              Schedule
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[11px] py-1 px-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50"
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
            <Link to="/hotspots" className="text-xs text-forest-700 hover:text-forest-900 font-semibold flex items-center gap-1">
              Full List <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {hotspots.slice(0, 3).map((hotspot) => (
              <Card key={hotspot.id} className="p-4 border-l-4 border-l-rose-500">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-xs text-charcoal-900">{hotspot.name}</h4>
                    <p className="text-[11px] text-charcoal-500">{hotspot.district}</p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                    {hotspot.priorityScore}/100
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-sage-100 flex items-center justify-between text-[11px] text-charcoal-600">
                  <span>Recurrence: <b>{hotspot.recurrenceCount} times</b></span>
                  <span className="text-rose-700 font-medium">{hotspot.trend}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-forest-900 text-offwhite-100 space-y-2">
            <h4 className="font-bold text-xs text-limeaccent-300">FastAPI & PostgreSQL Staging</h4>
            <p className="text-[11px] text-sage-200 leading-relaxed">
              In Phase 2, this command view will sync directly with PostgreSQL PostGIS spatial tables for automated DBSCAN cluster computation and dynamic heatmaps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

