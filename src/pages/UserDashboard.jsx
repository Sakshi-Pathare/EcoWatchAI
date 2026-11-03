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
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../components/common/Card';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-sage-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-sage-100 text-forest-800 mb-1.5">
            <Award className="w-3.5 h-3.5 text-limeaccent-700" />
            <span>Civic Environmental Contributor Level 2</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Reporter Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Track your logged pollution incidents, municipal verification status, and cleanup progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/report">
            <Button variant="primary" size="md" icon={Camera} className="shadow-sm">
              Report Litter
            </Button>
          </Link>
          <Link to="/map">
            <Button variant="outline" size="md" icon={MapPin}>
              View Live Map
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatWidget
          title="Total Reports Submitted"
          value={totalReports}
          subtext="Contributions to civic registry"
          icon={Layers}
          colorScheme="forest"
        />
        <StatWidget
          title="Cleaned & Restored"
          value={cleanedReports}
          subtext={`${totalReports > 0 ? Math.round((cleanedReports / totalReports) * 100) : 0}% verified resolution rate`}
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
          colorScheme="amber"
        />
      </div>

      {/* Main Content Grid: Recent Submissions & Cleanup Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Submissions */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-charcoal-900">Recent Litter Submissions</h2>
            <Link to="/my-reports" className="text-xs text-forest-700 hover:text-forest-900 font-semibold flex items-center gap-1">
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
                  <Card key={report.id} hover className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {report.imageUrl ? (
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-sage-100 border border-sage-200">
                          <img
                            src={report.imageUrl}
                            alt={report.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-sage-100 text-forest-700 flex items-center justify-center shrink-0">
                          <Camera className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-charcoal-400">
                            {report.id}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sevProps.bg}`}>
                            {sevProps.label}
                          </span>
                          <span className="text-xs text-charcoal-400">•</span>
                          <span className="text-xs text-charcoal-500">
                            {formatRelativeTime(report.reportedAt)}
                          </span>
                        </div>

                        <h3 className="font-semibold text-sm text-charcoal-900">
                          {report.title}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-charcoal-500">
                          <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                          <span className="truncate max-w-xs">{report.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-sage-100 gap-2 shrink-0">
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${statProps.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statProps.dot}`} />
                        {statProps.label}
                      </span>
                      <Link to="/my-reports" className="text-xs text-forest-700 hover:text-forest-900 font-medium inline-flex items-center gap-0.5">
                        Inspect <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Community & Cleanup Progress */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader title="Sanitation Progress" subtitle="Civic response in your district" />
            <CardBody className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-charcoal-700 mb-1.5">
                  <span>Cleanup Resolution Ratio</span>
                  <span className="font-bold text-forest-800">
                    {totalReports > 0 ? Math.round((cleanedReports / totalReports) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-sage-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-forest-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${totalReports > 0 ? (cleanedReports / totalReports) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-offwhite-200 border border-sage-200/80 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-600">Pending Review:</span>
                  <span className="font-semibold text-charcoal-900">{pendingReports} reports</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-600">Dispatched Crews:</span>
                  <span className="font-semibold text-forest-800">{inProgressReports} crews</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-600">Completed Sweeps:</span>
                  <span className="font-semibold text-forest-800">{cleanedReports} sites</span>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/cleanups">
                  <Button variant="outline" size="sm" className="w-full">
                    View City Cleanup Schedule
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>

          {/* Quick Hotspot Advisory Card */}
          <Card className="bg-gradient-to-br from-forest-50 to-white border-forest-200">
            <CardBody className="space-y-3">
              <div className="flex items-center gap-2 text-forest-900 font-bold text-sm">
                <Flame className="w-4 h-4 text-rose-600" />
                <span>Nearby Priority Hotspot</span>
              </div>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Mission Creek Drainage Corridor is currently registering elevated plastic accumulation. Extra volunteer reporting is encouraged.
              </p>
              <Link to="/hotspots">
                <span className="text-xs font-semibold text-forest-700 hover:text-forest-900 inline-flex items-center gap-1">
                  Explore Hotspot Analytics <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

