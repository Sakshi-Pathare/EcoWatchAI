import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Camera,
  MapPin,
  Calendar,
  ExternalLink,
  Search,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { reportService } from '../services/reportService';
import { getSeverityBadgeProps, getStatusBadgeProps, getCategoryLabel } from '../utils/formatters';
import { formatDate, formatRelativeTime } from '../utils/dateUtils';

export function MyReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'verified' | 'scheduled' | 'cleaned'
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const userReports = await reportService.getUserReports();
      setReports(userReports);
    } catch (e) {
      setLoadError(e.message || 'Unable to load your reports.');
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#1B4332]/10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#DEF5F1] text-[#092421] mb-2 border border-[#98E0D5] shadow-xs">
            <Layers className="w-3.5 h-3.5 text-[#1B4A45]" />
            <span>Civic Incident Ledger</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#10241B] tracking-tight">
            My Submissions & History
          </h1>
          <p className="text-xs sm:text-sm text-[#556E55] mt-1 max-w-xl font-medium">
            Review your pollution reports, current municipal status, and verified cleanup progress.
          </p>
        </div>

        <Link to="/report">
          <Button variant="pista" size="md" icon={Camera} glow className="shadow-lg rounded-full px-5 py-2.5 font-black hover:scale-105 active:scale-95 transition-all">
            Submit New Report
          </Button>
        </Link>
      </div>

      {/* Filter / Search Bar with Status Tabs */}
      <div className="glass-panel p-4 rounded-2xl border border-beige-300/90 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status filter tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {[
            { id: 'all', label: 'All Submissions' },
            { id: 'pending', label: 'Under Review' },
            { id: 'verified', label: 'Verified' },
            { id: 'scheduled', label: 'Scheduled' },
            { id: 'cleaned', label: 'Cleaned' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                statusFilter === tab.id
                  ? 'bg-[#092421] text-[#74D7CB] font-bold shadow-xs border border-[#27403C]'
                  : 'text-charcoal-700 hover:text-darkgreen-950 hover:bg-beige-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by title, report ID or street address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-darkgreen-700 bg-beige-50/90 text-charcoal-900 font-medium"
          />
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <LoadingSkeleton count={3} height="h-36" />
      ) : loadError ? (
        <div role="alert" className="p-5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-sm">There was a problem with your report history</h2>
            <p className="text-xs mt-1">{loadError}</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadReports}>
            Try again
          </Button>
        </div>
      ) : filteredReports.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No reports found"
          description={
            searchQuery
              ? 'No reports matched your search term.'
              : 'You have no submissions under this status. Report public litter in your area to get started!'
          }
          actionLabel="File a Litter Report"
          onAction={() => (window.location.href = '/report')}
        />
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const sevProps = getSeverityBadgeProps(report.severity);
            const statProps = getStatusBadgeProps(report.status);

            return (
              <Card
                key={report.id}
                hover
                className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-sage-200/90 shadow-soft group"
              >
                <div className="flex items-start gap-4">
                  {report.imageUrl ? (
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-sage-100 border border-sage-200 shadow-xs">
                      <img
                        src={report.imageUrl}
                        alt={report.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-sage-100 text-forest-700 flex items-center justify-center shrink-0">
                      <Camera className="w-8 h-8" />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-forest-800">
                        {report.id}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${sevProps.bg}`}>
                        {sevProps.label}
                      </span>
                      <span className="text-xs text-charcoal-400">•</span>
                      <span className="text-xs text-charcoal-500 flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                        {formatDate(report.reportedAt)} ({formatRelativeTime(report.reportedAt)})
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-charcoal-900 group-hover:text-forest-900 transition-colors">
                      {report.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-charcoal-500">
                      <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                      <span className="truncate">{report.address}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                      <span className="font-bold text-forest-900 text-[11px] bg-forest-50 px-2.5 py-0.5 rounded-md border border-forest-100">
                        {getCategoryLabel(report.category)}
                      </span>
                      <span className="text-charcoal-400">•</span>
                      <span className="text-charcoal-600 font-mono font-bold">~{report.estimatedKg} kg</span>
                    </div>
                  </div>
                </div>

                {/* Right Action & Status Column */}
                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-0 border-sage-100 gap-3 shrink-0">
                  <div className="flex flex-col items-start md:items-end gap-1">
                    <span className="text-[10px] text-charcoal-400 uppercase tracking-wider font-bold">
                      Resolution State
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-bold ${statProps.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statProps.dot}`} />
                      {statProps.label}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    icon={ExternalLink}
                    onClick={() => setSelectedReport(report)}
                    className="font-bold"
                  >
                    Report Details
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={selectedReport?.title || 'Report Audit Record'}
        maxWidth="max-w-2xl"
      >
        {selectedReport && (
          <div className="space-y-5 text-xs text-charcoal-700 font-sans">
            {selectedReport.imageUrl && (
              <div className="w-full h-64 rounded-2xl overflow-hidden bg-sage-100 border border-sage-200 shadow-soft relative group">
                <img
                  src={selectedReport.imageUrl}
                  alt={selectedReport.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-mono text-[10px]">
                  GPS Coordinates: {selectedReport.latitude.toFixed(4)}°, {selectedReport.longitude.toFixed(4)}°
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-offwhite-200 border border-sage-200">
                <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">Reference</span>
                <p className="font-mono font-black text-charcoal-900 text-xs mt-0.5">{selectedReport.id}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-offwhite-200 border border-sage-200">
                <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">Logged Date</span>
                <p className="font-bold text-charcoal-900 text-xs mt-0.5">{formatDate(selectedReport.reportedAt)}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-offwhite-200 border border-sage-200">
                <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">Material</span>
                <p className="font-bold text-forest-800 text-xs mt-0.5 truncate">{getCategoryLabel(selectedReport.category)}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-offwhite-200 border border-sage-200">
                <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">Status</span>
                <p className="font-extrabold text-charcoal-900 text-xs mt-0.5 capitalize">{selectedReport.status}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-charcoal-900 mb-1 text-xs">Incident Description</h4>
              <p className="p-3.5 rounded-xl bg-offwhite-100 border border-sage-200 text-charcoal-700 leading-relaxed text-xs font-medium">
                {selectedReport.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 space-y-1">
              <div className="flex items-center gap-1.5 text-forest-900 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-limeaccent-600" />
                <span>Image Analysis</span>
              </div>
              <p className="text-forest-800 text-[11px] leading-relaxed">
                {selectedReport.detectionNote}
              </p>
              {selectedReport.detections?.length > 0 && (
                <ul className="pt-2 flex flex-wrap gap-2">
                  {selectedReport.detections.map((detection, index) => (
                    <li
                      key={`${detection.label}-${index}`}
                      className="px-2 py-1 rounded-lg bg-white border border-forest-200 text-[10px] font-mono text-forest-900"
                    >
                      {detection.label} · {Math.round(detection.confidence * 100)}%
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-sage-200">
              <span className="text-charcoal-500 font-mono text-[11px]">
                Report Address: {selectedReport.address}
              </span>
              <Button variant="primary" size="sm" onClick={() => setSelectedReport(null)}>
                Close Record
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
