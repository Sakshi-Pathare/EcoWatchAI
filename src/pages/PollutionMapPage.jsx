import React, { useState, useEffect } from 'react';
import {
  MapPin,
  List,
  Filter,
  Search,
  Flame,
  Layers,
  ChevronRight,
  SlidersHorizontal,
  X,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card, CardBody } from '../components/common/Card';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { reportService } from '../services/reportService';
import { hotspotService } from '../services/hotspotService';
import { getSeverityBadgeProps, getStatusBadgeProps, getCategoryLabel } from '../utils/formatters';
import { formatDate, formatRelativeTime } from '../utils/dateUtils';

export function PollutionMapPage() {
  const [reports, setReports] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  const [selectedReport, setSelectedReport] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showHotspotLayers, setShowHotspotLayers] = useState(true);

  useEffect(() => {
    fetchData();
  }, [severityFilter, statusFilter, categoryFilter, searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedReports, fetchedHotspots] = await Promise.all([
        reportService.getAllReports({
          severity: severityFilter,
          status: statusFilter,
          category: categoryFilter,
          search: searchTerm,
        }),
        hotspotService.getHotspots(),
      ]);
      setReports(fetchedReports);
      setHotspots(fetchedHotspots);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-sage-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded bg-forest-100 text-forest-800 mb-1">
            <MapPin className="w-3.5 h-3.5 text-forest-700" />
            <span>GIS Geospatial Visualizer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Pollution & Hotspot Map
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-0.5">
            Real-time geospatial intelligence, recurrence clusters, and active cleanup coordinates.
          </p>
        </div>

        {/* View Mode Toggle & Layer Switch */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHotspotLayers(!showHotspotLayers)}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all inline-flex items-center gap-1.5 ${
              showHotspotLayers
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-white border-sage-300 text-charcoal-600'
            }`}
            title="Toggle Hotspot Risk Zones"
          >
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>Hotspots {showHotspotLayers ? 'ON' : 'OFF'}</span>
          </button>

          <div className="bg-sage-100 p-1 rounded-xl flex items-center border border-sage-200">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-forest-900 shadow-sm'
                  : 'text-charcoal-600 hover:text-forest-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" /> Map View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-forest-900 shadow-sm'
                  : 'text-charcoal-600 hover:text-forest-900'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List View ({reports.length})
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-sage-200 shadow-soft flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 items-center min-w-[200px] max-w-md relative">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by area, description, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-offwhite-50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Severity filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-sage-200 bg-white text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            <option value="all">All Severities</option>
            <option value="high">Critical Impact</option>
            <option value="medium">Moderate Impact</option>
            <option value="low">Low Impact</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-sage-200 bg-white text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Under Review</option>
            <option value="verified">Verified</option>
            <option value="scheduled">Scheduled</option>
            <option value="cleaned">Cleaned</option>
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-sage-200 bg-white text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            <option value="all">All Categories</option>
            <option value="plastic">Plastics</option>
            <option value="glass">Glass</option>
            <option value="metal">Metal</option>
            <option value="hazardous">Hazardous</option>
            <option value="paper">Paper</option>
            <option value="mixed">Mixed</option>
          </select>

          {(severityFilter !== 'all' || statusFilter !== 'all' || categoryFilter !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setSeverityFilter('all');
                setStatusFilter('all');
                setCategoryFilter('all');
                setSearchTerm('');
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 inline-flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Map / List View Container */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <InteractiveMap
            reports={reports}
            hotspots={hotspots}
            height="620px"
            showHotspotOverlays={showHotspotLayers}
            onSelectReport={(r) => setSelectedReport(r)}
          />

          {/* Legend Banner */}
          <div className="p-3 bg-white rounded-xl border border-sage-200 flex flex-wrap items-center justify-between gap-4 text-xs shadow-soft">
            <div className="flex flex-wrap items-center gap-5">
              <span className="font-semibold text-charcoal-700">Map Legend:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-600" />
                <span className="text-charcoal-600">Critical / High Severity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-charcoal-600">Moderate Severity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <span className="text-charcoal-600">Low Severity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border border-dashed border-rose-600 bg-rose-100" />
                <span className="text-charcoal-600">Hotspot Risk Radius</span>
              </div>
            </div>

            <span className="text-charcoal-400">
              Showing {reports.length} incidents across active municipal zones
            </span>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {loading ? (
            <LoadingSkeleton count={4} height="h-28" />
          ) : reports.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="No reports match your filters"
              description="Try adjusting your severity, status, or search query to view active markers."
              actionLabel="Clear Filters"
              onAction={() => {
                setSeverityFilter('all');
                setStatusFilter('all');
                setCategoryFilter('all');
                setSearchTerm('');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reports.map((report) => {
                const sevProps = getSeverityBadgeProps(report.severity);
                const statProps = getStatusBadgeProps(report.status);

                return (
                  <Card key={report.id} hover onClick={() => setSelectedReport(report)} className="flex flex-col h-full">
                    {report.imageUrl && (
                      <div className="h-40 w-full overflow-hidden relative bg-sage-100">
                        <img
                          src={report.imageUrl}
                          alt={report.title}
                          className="w-full h-full object-cover"
                        />
                        <span className={`absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sevProps.bg}`}>
                          {sevProps.label}
                        </span>
                      </div>
                    )}

                    <CardBody className="flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs text-charcoal-400 font-mono mb-1">
                          <span>{report.id}</span>
                          <span>{formatDate(report.reportedAt)}</span>
                        </div>
                        <h3 className="font-bold text-sm text-charcoal-900 line-clamp-1">
                          {report.title}
                        </h3>
                        <p className="text-xs text-charcoal-600 line-clamp-2 mt-1">
                          {report.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-sage-100 text-xs space-y-2">
                        <div className="flex items-center gap-1.5 text-charcoal-500">
                          <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                          <span className="truncate">{report.address}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-forest-800 text-[11px]">
                            {getCategoryLabel(report.category)}
                          </span>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statProps.bg}`}>
                            {statProps.label}
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Selected Report Detail Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={selectedReport?.title || 'Report Details'}
        maxWidth="max-w-2xl"
      >
        {selectedReport && (
          <div className="space-y-5 text-xs text-charcoal-700">
            {selectedReport.imageUrl && (
              <div className="w-full h-56 rounded-xl overflow-hidden bg-sage-100 border border-sage-200">
                <img
                  src={selectedReport.imageUrl}
                  alt={selectedReport.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-offwhite-200 border border-sage-200">
                <span className="text-[10px] text-charcoal-400 font-medium">Report ID</span>
                <p className="font-mono font-bold text-charcoal-900 text-xs mt-0.5">{selectedReport.id}</p>
              </div>
              <div className="p-3 rounded-lg bg-offwhite-200 border border-sage-200">
                <span className="text-[10px] text-charcoal-400 font-medium">Logged Date</span>
                <p className="font-semibold text-charcoal-900 text-xs mt-0.5">{formatDate(selectedReport.reportedAt)}</p>
              </div>
              <div className="p-3 rounded-lg bg-offwhite-200 border border-sage-200">
                <span className="text-[10px] text-charcoal-400 font-medium">Material</span>
                <p className="font-semibold text-forest-800 text-xs mt-0.5">{getCategoryLabel(selectedReport.category)}</p>
              </div>
              <div className="p-3 rounded-lg bg-offwhite-200 border border-sage-200">
                <span className="text-[10px] text-charcoal-400 font-medium">Estimated Mass</span>
                <p className="font-semibold text-charcoal-900 text-xs mt-0.5">~{selectedReport.estimatedKg} kg</p>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-charcoal-900">Incident Description</h4>
              <p className="leading-relaxed text-charcoal-600 bg-offwhite-100 p-3 rounded-lg border border-sage-200">
                {selectedReport.description}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-forest-50 border border-forest-200 space-y-1">
              <span className="font-bold text-forest-900 text-[11px]">Computer Vision & AI Classification Staging</span>
              <p className="text-forest-700 text-[11px] leading-relaxed">
                {selectedReport.detectionNote}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-sage-200">
              <span className="text-charcoal-500 font-mono text-[11px]">
                Coordinates: {selectedReport.latitude.toFixed(4)}, {selectedReport.longitude.toFixed(4)}
              </span>
              <Button variant="primary" size="sm" onClick={() => setSelectedReport(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

