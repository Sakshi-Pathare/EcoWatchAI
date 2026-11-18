import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  MapPin,
  Flame,
  Award,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Activity,
  Compass,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { StatWidget } from '../components/common/StatWidget';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { reportService } from '../services/reportService';
import { getSeverityBadgeProps, getStatusBadgeProps, getCategoryLabel } from '../utils/formatters';
import { formatRelativeTime } from '../utils/dateUtils';

export function UserDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const userReports = await reportService.getUserReports('usr_current');
      setReports(userReports);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalReports = reports.length;
  const cleanedReports = reports.filter((r) => r.status === 'cleaned').length;
  const inProgressReports = reports.filter((r) => r.status === 'scheduled' || r.status === 'verified').length;
  const pendingReports = reports.filter((r) => r.status === 'pending').length;

  const totalEstimatedKg = reports.reduce((acc, r) => acc + (r.estimatedKg || 0), 0);

  // Civic reputation rank calculation
  const ecoPoints = totalReports * 50 + cleanedReports * 100;
  const nextTierPoints = 500;
  const tierProgress = Math.min(100, Math.round((ecoPoints / nextTierPoints) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-beige-300/80">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-sage-100 text-darkgreen-900 mb-2 border border-sage-300 shadow-xs">
            <Award className="w-3.5 h-3.5 text-darkgreen-700" />
            <span>Civic Environmental Contributor • Tier 2</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-darkgreen-950 tracking-tight">
            Reporter Command Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-sage-700 mt-1 max-w-xl font-medium">
            Track your submitted pollution incidents, municipal verification status, and cleanup progress in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/report">
            <Button variant="primary" size="md" icon={Camera} glow className="shadow-md">
              Report Litter Incident
            </Button>
          </Link>
          <Link to="/map">
            <Button variant="outline" size="md" icon={Compass}>
              View Live Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Citizen Eco-Reputation Hero Capsule */}
      <div className="glass-panel p-6 rounded-3xl border border-beige-300/90 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-darkgreen-950">Alex Mercer</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sage-200 text-darkgreen-900 border border-sage-300">
              ECO SENTINEL
            </span>
          </div>
          <p className="text-xs text-charcoal-700 font-medium">
            You are in the <b className="text-darkgreen-900">top 8%</b> of civic reporters in the San Francisco Municipal District.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs font-mono">
            <span className="text-darkgreen-800 font-bold">{ecoPoints} Eco Points</span>
            <span className="text-sage-400">•</span>
            <span className="text-sage-600 font-medium">{nextTierPoints - ecoPoints} pts to Tier 3 Guardian</span>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="w-full md:w-72 space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-darkgreen-900">Tier 2 Progress</span>
            <span className="text-botanical-700 font-mono">{tierProgress}%</span>
          </div>
          <div className="w-full h-3 bg-beige-200 rounded-full overflow-hidden p-0.5 border border-beige-300">
            <div
              className="h-full bg-gradient-to-r from-darkgreen-800 via-botanical-600 to-sage-500 rounded-full transition-all duration-700"
              style={{ width: `${tierProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatWidget
          title="Total Reports Logged"
          value={totalReports}
          subtext="Contributions to civic registry"
          icon={Layers}
          colorScheme="forest"
        />
        <StatWidget
          title="Cleaned & Restored"
          value={cleanedReports}
          subtext={`${totalReports > 0 ? Math.round((cleanedReports / totalReports) * 100) : 0}% verified resolution`}
          icon={CheckCircle2}
          colorScheme="forest"
          trend="+1 this week"
        />
        <StatWidget
          title="In Municipal Pipeline"
          value={inProgressReports}
          subtext="Scheduled for sanitation crew"
          icon={Clock}
          colorScheme="blue"
        />
        <StatWidget
          title="Est. Waste Diverted"
          value={`${totalEstimatedKg.toFixed(1)} kg`}
          subtext="Total environmental footprint"
          icon={Sparkles}
          colorScheme="lime"
        />
      </div>

      {/* Main Content Grid: Recent Submissions & Cleanup Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Submissions */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-charcoal-900">Recent Litter Submissions</h2>
            <Link to="/my-reports" className="text-xs text-forest-800 hover:text-forest-950 font-bold flex items-center gap-1">
              View all reports <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton count={3} height="h-28" />
          ) : reports.length === 0 ? (
            <EmptyState
              icon={Layers}
              title="No litter reports yet"
              description="You have not submitted any litter reports. Help clean up your community by photographing public pollution."
              actionLabel="Report Your First Incident"
              onAction={() => window.location.href = '/report'}
            />
          ) : (
            <div className="space-y-3.5">
              {reports.slice(0, 4).map((report) => {
                const sevProps = getSeverityBadgeProps(report.severity);
                const statProps = getStatusBadgeProps(report.status);

                return (
                  <Card key={report.id} hover className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-sage-200/90 shadow-soft">
                    <div className="flex items-start gap-4">
                      {report.imageUrl ? (
                        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-sage-100 border border-sage-200 shadow-xs">
                          <img
                            src={report.imageUrl}
                            alt={report.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-sage-100 text-forest-700 flex items-center justify-center shrink-0">
                          <Camera className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-forest-800">
                            {report.id}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${sevProps.bg}`}>
                            {sevProps.label}
                          </span>
                          <span className="text-xs text-charcoal-400">•</span>
                          <span className="text-xs text-charcoal-500 font-medium">
                            {formatRelativeTime(report.reportedAt)}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-sm text-charcoal-900">
                          {report.title}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-charcoal-500">
                          <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                          <span className="truncate max-w-xs">{report.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-sage-100 gap-2 shrink-0">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-bold ${statProps.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statProps.dot}`} />
                        {statProps.label}
                      </span>
                      <Link to="/my-reports" className="text-xs text-forest-800 hover:text-forest-950 font-bold inline-flex items-center gap-0.5">
                        Inspect <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Progress & Hotspot Advisory */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-beige-300/90 shadow-soft">
            <CardHeader title="Sanitation Progress" subtitle="Civic response in your district" icon={Activity} />
            <CardBody className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-darkgreen-950 mb-1.5">
                  <span>Cleanup Resolution Ratio</span>
                  <span className="font-mono font-black text-botanical-700">
                    {totalReports > 0 ? Math.round((cleanedReports / totalReports) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-beige-200 rounded-full overflow-hidden p-0.5 border border-beige-300">
                  <div
                    className="h-full bg-gradient-to-r from-darkgreen-700 to-botanical-500 rounded-full transition-all duration-700"
                    style={{
                      width: `${totalReports > 0 ? (cleanedReports / totalReports) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-beige-100/90 border border-beige-300/80 text-xs space-y-2.5 font-medium">
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-600">Pending Review:</span>
                  <span className="font-bold text-charcoal-900">{pendingReports} reports</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-600">Dispatched Crews:</span>
                  <span className="font-bold text-darkgreen-800">{inProgressReports} squads</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-600">Completed Sweeps:</span>
                  <span className="font-bold text-botanical-700">{cleanedReports} sites certified</span>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/cleanups">
                  <Button variant="outline" size="sm" className="w-full font-bold">
                    View City Sanitation Schedule
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>

          {/* Quick Hotspot Advisory Card */}
          <Card className="bg-gradient-to-br from-beige-100 via-beige-50 to-sage-50/60 border-2 border-sage-300 shadow-soft">
            <CardBody className="space-y-3">
              <div className="flex items-center gap-2 text-darkgreen-950 font-bold text-sm">
                <Flame className="w-4 h-4 text-rose-600 animate-pulse" />
                <span>Nearby Priority Hotspot Alert</span>
              </div>
              <p className="text-xs text-charcoal-700 leading-relaxed font-medium">
                <b className="text-darkgreen-950">Mission Creek Drainage Corridor</b> is currently registering elevated plastic accumulation. Extra volunteer reporting is requested.
              </p>
              <Link to="/hotspots" className="block pt-1">
                <span className="text-xs font-bold text-darkgreen-800 hover:text-darkgreen-950 inline-flex items-center gap-1">
                  Explore Hotspot Analytics <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
