import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Camera,
  MapPin,
  Calendar,
  ExternalLink,
  Search,
  CheckCircle,
  Clock,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card, CardBody } from '../components/common/Card';
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
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
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

  const handleDeleteReport = async (id) => {
    if (!window.confirm(`Are you sure you want to remove report ${id}?`)) return;
    try {
      await reportService.deleteReport(id);
      setSelectedReport(null);
      setDeleteSuccess(`Report ${id} removed successfully.`);
      loadReports();
      setTimeout(() => setDeleteSuccess(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredReports = reports.filter(
    (r) =>
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-sage-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-forest-100 text-forest-800 mb-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Civic Incident Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            My Submissions & History
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Review your uploaded pollution reports, municipal inspection notes, and cleanup verification.
          </p>
        </div>

        <Link to="/report">
          <Button variant="primary" size="md" icon={Camera} className="shadow-sm">
            Submit New Report
          </Button>
        </Link>
      </div>

      {deleteSuccess && (
        <div className="p-3.5 rounded-xl bg-forest-50 border border-forest-200 text-forest-800 text-xs font-medium flex items-center gap-2 shadow-soft">
          <CheckCircle className="w-4 h-4 text-forest-600 shrink-0" />
          <span>{deleteSuccess}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search your reports by title, ID or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
          />
        </div>

        <span className="text-xs text-charcoal-500">
          Showing {filteredReports.length} of {reports.length} submissions
        </span>
      </div>

      {/* Reports Table or Grid */}
      {loading ? (
        <LoadingSkeleton count={3} height="h-32" />
      ) : filteredReports.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No reports found"
          description={
            searchQuery
              ? 'No reports matched your search term.'
              : 'You have not submitted any litter reports yet. Clean up your city today!'
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
                className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4">
                  {report.imageUrl ? (
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-sage-100 border border-sage-200">
                      <img
                        src={report.imageUrl}
                        alt={report.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-sage-100 text-forest-700 flex items-center justify-center shrink-0">
                      <Camera className="w-8 h-8" />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-charcoal-500">
                        {report.id}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sevProps.bg}`}>
                        {sevProps.label}
                      </span>
                      <span className="text-xs text-charcoal-400">•</span>
                      <span className="text-xs text-charcoal-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(report.reportedAt)} ({formatRelativeTime(report.reportedAt)})
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-charcoal-900">{report.title}</h3>

                    <div className="flex items-center gap-1.5 text-xs text-charcoal-500">
                      <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                      <span className="truncate">{report.address}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                      <span className="font-medium text-forest-800">
                        Material: {getCategoryLabel(report.category)}
                      </span>
                      <span className="text-charcoal-400">•</span>
                      <span className="text-charcoal-600">Est: {report.estimatedKg} kg</span>
                    </div>
                  </div>
                </div>

                {/* Right Action column */}
                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-0 border-sage-100 gap-3 shrink-0">
                  <div className="flex flex-col items-start md:items-end gap-1">
                    <span className="text-[10px] text-charcoal-400 uppercase tracking-wider font-semibold">
                      Cleanup Status
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-semibold ${statProps.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statProps.dot}`} />
                      {statProps.label}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    icon={ExternalLink}
                    onClick={() => setSelectedReport(report)}
                  >
                    View Details
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
        title={selectedReport?.title || 'Report Details'}
        maxWidth="max-w-2xl"
      >
        {selectedReport && (
          <div className="space-y-5 text-xs text-charcoal-700">
            {selectedReport.imageUrl && (
              <div className="w-full h-64 rounded-xl overflow-hidden bg-sage-100 border border-sage-200">
                <img
                  src={selectedReport.imageUrl}
                  alt={selectedReport.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-offwhite-200 border border-sage-200">
                <span className="text-[10px] text-charcoal-400 font-medium">Report Reference</span>
                <p className="font-mono font-bold text-charcoal-900 text-xs mt-0.5">{selectedReport.id}</p>
              </div>
              <div className="p-3 rounded-lg bg-offwhite-200 border border-sage-200">
                <span className="text-[10px] text-charcoal-400 font-medium">Logged Timestamp</span>
                <p className="font-semibold text-charcoal-900 text-xs mt-0.5">{formatDate(selectedReport.reportedAt)}</p>
              </div>
              <div className="p-3 rounded-lg bg-offwhite-200 border border-sage-200">
                <span className="text-[10px] text-charcoal-400 font-medium">Litter Material</span>
                <p className="font-semibold text-forest-800 text-xs mt-0.5">{getCategoryLabel(selectedReport.category)}</p>
              </div>
              <div className="p-3 rounded-lg bg-offwhite-200 border border-sage-200">
                <span className="text-[10px] text-charcoal-400 font-medium">Status</span>
                <p className="font-semibold text-charcoal-900 text-xs mt-0.5 capitalize">{selectedReport.status}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-charcoal-900 mb-1">Detailed Description</h4>
              <p className="p-3 rounded-lg bg-offwhite-100 border border-sage-200 text-charcoal-600 leading-relaxed">
                {selectedReport.description}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-forest-50 border border-forest-200 space-y-1">
              <div className="flex items-center gap-1.5 text-forest-900 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-limeaccent-600" />
                <span>Detection & Computer Vision Pipeline Note</span>
              </div>
              <p className="text-forest-800 text-[11px] leading-relaxed">
                {selectedReport.detectionNote}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-sage-200">
              <span className="text-charcoal-500 font-mono text-[11px]">
                GPS: {selectedReport.latitude.toFixed(4)}, {selectedReport.longitude.toFixed(4)}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={() => handleDeleteReport(selectedReport.id)}
                >
                  Delete Submission
                </Button>
                <Button variant="primary" size="sm" onClick={() => setSelectedReport(null)}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

