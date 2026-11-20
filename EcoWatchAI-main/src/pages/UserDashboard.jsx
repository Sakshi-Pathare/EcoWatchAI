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
import { hotspotService } from '../services/hotspotService';
import { getSeverityBadgeProps, getStatusBadgeProps, getCategoryLabel } from '../utils/formatters';
import { formatRelativeTime } from '../utils/dateUtils';
import { useAuth } from '../contexts/AuthContext';

export function UserDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [userReports, currentHotspots] = await Promise.all([
        reportService.getUserReports(),
        hotspotService.getPublicHotspots('priority'),
      ]);
      setReports(userReports);
      setHotspots(currentHotspots);
    } catch (e) {
      setLoadError(e.message || 'Unable to load your dashboard data.');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {loadError && (
        <div role="alert" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-center justify-between gap-3">
          <span>{loadError}</span>
          <Button variant="outline" size="sm" onClick={loadData}>Retry</Button>
        </div>
      )}
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#1B4332]/10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#DEF5F1] text-[#092421] mb-2 border border-[#98E0D5] shadow-xs">
            <Award className="w-3.5 h-3.5 text-[#1B4A45]" />
            <span>Community Reporter Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#10241B] tracking-tight">
            Reporter Command Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#556E55] mt-1 max-w-xl font-medium">
            Track reports submitted by your account, municipal verification status, and cleanup progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/report">
            <Button variant="primary" size="md" icon={Camera} className="px-5 py-2.5">
              Report Litter Incident
            </Button>
          </Link>
          <Link to="/map">
            <Button variant="outline" size="md" icon={Compass} className="rounded-full px-5 py-2.5 font-bold">
              Explore Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Anonymous reporter identity */}
      <div className="card-paper p-6 sm:p-7 rounded-[2rem] border border-[#1B4332]/15 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="font-serif font-bold text-xl text-[#10241B]">{user?.name || 'Community Reporter'}</span>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-900 border border-forest-200">
              VERIFIED ACCOUNT
            </span>
          </div>
          <p className="text-xs text-[#242D2B] font-medium">
            Your submissions are linked securely to your Vasundhara AI account and are visible only to you and authorized municipal administrators.
          </p>
        </div>
        <div className="text-sm font-bold text-[#2D6A4F]">{totalReports} submitted reports</div>
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
        />
        <StatWidget
          title="In Municipal Pipeline"
          value={inProgressReports}
          subtext="Scheduled for sanitation crew"
          icon={Clock}
          colorScheme="blue"
        />
        <StatWidget
          title="Est. Reported Waste"
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
            <h2 className="text-xl font-serif font-bold text-[#10241B]">Recent Litter Submissions</h2>
            <Link to="/my-reports" className="text-xs text-[#1B4332] hover:text-[#10241B] font-bold flex items-center gap-1">
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
                        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-[#E5EDE5] border border-[#CCDCCC] shadow-xs">
                          <img
                            src={report.imageUrl}
                            alt={report.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-[#DEF5F1] text-[#10241B] flex items-center justify-center shrink-0">
                          <Camera className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-black text-[#10241B]">
                            {report.id}
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${sevProps.bg}`}>
                            {sevProps.label}
                          </span>
                          <span className="text-xs text-[#8FA88F]">•</span>
                          <span className="text-xs text-[#556E55] font-bold">
                            {formatRelativeTime(report.reportedAt)}
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-base text-[#10241B]">
                          {report.title}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-[#556E55] font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0" />
                          <span className="truncate max-w-xs">{report.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-[#1B4332]/10 gap-2 shrink-0">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-bold ${statProps.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statProps.dot}`} />
                        {statProps.label}
                      </span>
                      <Link to="/my-reports" className="text-xs text-[#10241B] hover:text-[#2D6A4F] font-black inline-flex items-center gap-0.5">
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
          <Card>
            <CardHeader title="Sanitation Progress" subtitle="Status of your submitted reports" icon={Activity} />
            <CardBody className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#10241B] mb-1.5">
                  <span>Cleanup Resolution Ratio</span>
                  <span className="font-mono font-black text-[#2D6A4F]">
                    {totalReports > 0 ? Math.round((cleanedReports / totalReports) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#EFE3D5] rounded-full overflow-hidden p-0.5 border border-[#D3BCA6]">
                  <div
                    className="h-full bg-forest-700 rounded-full transition-all duration-300"
                    style={{
                      width: `${totalReports > 0 ? (cleanedReports / totalReports) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7EFE6]/70 border border-[#1B4332]/10 text-xs space-y-2.5 font-medium">
                <div className="flex items-center justify-between">
                  <span className="text-[#556E55]">Pending Review:</span>
                  <span className="font-bold text-[#10241B]">{pendingReports} reports</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#556E55]">Dispatched Crews:</span>
                  <span className="font-bold text-[#10241B]">{inProgressReports} squads</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#556E55]">Completed Sweeps:</span>
                  <span className="font-bold text-[#2D6A4F]">{cleanedReports} sites certified</span>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/cleanups">
                  <Button variant="outline" size="sm" className="w-full font-bold rounded-full">
                    View City Sanitation Schedule
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>

          {/* Quick Hotspot Advisory Card */}
          <Card className="border-sage-200">
            <CardBody className="space-y-3">
              <div className="flex items-center gap-2 text-[#10241B] font-bold text-sm">
                <Flame className="w-4 h-4 text-rose-700" />
                <span className="font-serif font-bold text-base">Nearby Priority Hotspot Alert</span>
              </div>
              <p className="text-xs text-[#242D2B] leading-relaxed font-medium">
                {hotspots.length > 0 ? (
                  <>
                    <b className="text-[#10241B]">{hotspots[0].name}</b> has {hotspots[0].recurrenceCount} reports within its mapped area and a priority score of {hotspots[0].priorityScore}/100.
                  </>
                ) : (
                  'No recurring hotspot is identified yet. Nearby reports will be grouped after at least two reports fall within 300 meters.'
                )}
              </p>
              <Link to="/hotspots" className="block pt-1">
                <span className="text-xs font-bold text-[#10241B] hover:text-[#2D6A4F] inline-flex items-center gap-1">
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
