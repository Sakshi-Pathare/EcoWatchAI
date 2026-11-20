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
  Sparkles,
  Compass,
  CheckCircle2,
  Scale,
  Calendar,
  Share2,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
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
  const [loadError, setLoadError] = useState('');
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
    setLoadError('');
    try {
      const [fetchedReports, fetchedHotspots] = await Promise.all([
        reportService.getPublicReports({
          severity: severityFilter,
          status: statusFilter,
          category: categoryFilter,
          search: searchTerm,
        }),
        hotspotService.getPublicHotspots(),
      ]);
      setReports(fetchedReports);
      setHotspots(fetchedHotspots);
    } catch (e) {
      setLoadError(e.message || 'Unable to load public map data.');
    } finally {
      setLoading(false);
    }
  };

  const highSeverityCount = reports.filter(r => r.severity === 'high' || r.severity === 'critical').length;
  const verifiedCount = reports.filter(r => r.status === 'verified' || r.status === 'cleaned').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {loadError && (
        <div role="alert" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-center justify-between gap-3">
          <span>{loadError}</span>
          <Button variant="outline" size="sm" onClick={fetchData}>Retry</Button>
        </div>
      )}
      {/* Top Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1B4332]/10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#DEF5F1] text-[#092421] mb-2 border border-[#98E0D5] shadow-xs">
            <Compass className="w-3.5 h-3.5 text-[#1B4A45] animate-spin-slow" />
            <span>GIS Geospatial Cartography Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#10241B] tracking-tight">
            Pollution & Hotspot GIS Map
          </h1>
          <p className="text-xs sm:text-sm text-[#556E55] mt-1 max-w-xl leading-relaxed font-medium">
            Report-based geospatial intelligence, recurring litter clusters, and cleanup coordinates from the project database.
          </p>
        </div>

        {/* View Mode Toggle & Layer Switch */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowHotspotLayers(!showHotspotLayers)}
            className={`px-4 py-2 text-xs font-bold rounded-full border transition-all inline-flex items-center gap-2 shadow-xs ${
              showHotspotLayers
                ? 'bg-rose-50 border-rose-300 text-rose-800 ring-2 ring-rose-400/20'
                : 'bg-white border-[#1B4332]/15 text-[#242D2B] hover:bg-[#FAF8F3]'
            }`}
            title="Toggle Hotspot Risk Zones"
          >
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>Hotspots Overlay {showHotspotLayers ? 'ON' : 'OFF'}</span>
          </button>

          <div className="bg-white p-1 rounded-lg flex items-center border border-sage-200">
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
                viewMode === 'map'
                  ? 'bg-forest-100 text-forest-900 border border-forest-200'
                  : 'text-charcoal-600 hover:text-forest-900 hover:bg-sage-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" /> Map View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
                viewMode === 'list'
                  ? 'bg-forest-100 text-forest-900 border border-forest-200'
                  : 'text-charcoal-600 hover:text-forest-900 hover:bg-sage-100'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List View ({reports.length})
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar with Quick Metrics */}
      <div className="card-paper p-4 sm:p-5 rounded-[1.75rem] border border-[#1B4332]/15 shadow-soft space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search box */}
          <div className="flex flex-1 items-center min-w-[240px] relative">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by neighborhood, street, description or report ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-darkgreen-700 bg-beige-50/90 placeholder:text-charcoal-400 text-charcoal-900 font-medium"
            />
          </div>

          {/* Dropdown filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="text-xs py-2 px-3.5 rounded-xl border border-sage-300 bg-beige-50 text-charcoal-800 font-semibold focus:outline-none focus:ring-2 focus:ring-darkgreen-700 shadow-xs"
            >
              <option value="all">All Severities</option>
              <option value="high">Critical Impact Only</option>
              <option value="medium">Moderate Impact</option>
              <option value="low">Low Impact</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-2 px-3.5 rounded-xl border border-sage-300 bg-beige-50 text-charcoal-800 font-semibold focus:outline-none focus:ring-2 focus:ring-darkgreen-700 shadow-xs"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Under Review</option>
              <option value="verified">Verified</option>
              <option value="scheduled">Scheduled</option>
              <option value="cleaned">Cleaned</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs py-2 px-3.5 rounded-xl border border-sage-300 bg-beige-50 text-charcoal-800 font-semibold focus:outline-none focus:ring-2 focus:ring-darkgreen-700 shadow-xs"
            >
              <option value="all">All Material Types</option>
              <option value="plastic">Plastics & Packaging</option>
              <option value="glass">Glass & Bottles</option>
              <option value="metal">Metal & Cans</option>
              <option value="hazardous">Hazardous / E-Waste</option>
              <option value="paper">Paper & Cardboard</option>
              <option value="mixed">Mixed Litter</option>
            </select>

            {(severityFilter !== 'all' || statusFilter !== 'all' || categoryFilter !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setSeverityFilter('all');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setSearchTerm('');
                }}
                className="text-xs text-rose-700 hover:text-rose-900 font-bold px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 inline-flex items-center gap-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Presets Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-beige-300/80 text-xs">
          <span className="text-[11px] font-bold text-sage-600 uppercase tracking-wider">Quick Presets:</span>
          <button
            onClick={() => { setSeverityFilter('high'); }}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
              severityFilter === 'high' ? 'bg-rose-600 text-white shadow-xs' : 'bg-beige-50 text-rose-800 border border-rose-200 hover:bg-rose-50'
            }`}
          >
            🔥 High Priority Dumps ({highSeverityCount})
          </button>
          <button
            onClick={() => { setStatusFilter('cleaned'); }}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
              statusFilter === 'cleaned' ? 'bg-[#092421] text-[#74D7CB] shadow-xs' : 'bg-beige-50 text-darkgreen-800 border border-sage-300 hover:bg-pista-100'
            }`}
          >
            ✓ Certified Restored ({reports.filter(r => r.status === 'cleaned').length})
          </button>
          <button
            onClick={() => { setCategoryFilter('plastic'); }}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
              categoryFilter === 'plastic' ? 'bg-[#092421] text-[#74D7CB] shadow-xs' : 'bg-beige-50 text-charcoal-700 border border-beige-300 hover:bg-beige-100'
            }`}
          >
            Plastics Only
          </button>
        </div>
      </div>

      {/* Main Map / List View Container */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <InteractiveMap
            reports={reports}
            hotspots={hotspots}
            height="640px"
            showHotspotOverlays={showHotspotLayers}
            onSelectReport={(r) => setSelectedReport(r)}
            autoLocate={true}
          />

          {/* Map Legend Banner */}
          <div className="card-paper p-4 rounded-[1.75rem] border border-[#1B4332]/15 flex flex-wrap items-center justify-between gap-4 text-xs shadow-soft">
            <div className="flex flex-wrap items-center gap-6">
              <span className="font-bold text-[#10241B] text-[11px] uppercase tracking-wider">Map Legend:</span>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-forest-700 border-2 border-white" />
                <span className="font-bold text-[#10241B]">Your Live Location</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-600" />
                <span className="font-semibold text-[#242D2B]">Critical Severity</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500" />
                <span className="font-semibold text-[#242D2B]">Moderate Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                <span className="font-semibold text-[#242D2B]">Low Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-rose-600 bg-rose-100" />
                <span className="font-semibold text-[#242D2B]">Hotspot Buffer</span>
              </div>
            </div>

            <span className="font-mono text-xs text-[#556E55] font-bold">
              Showing {reports.length} live incident pins
            </span>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {loading ? (
            <LoadingSkeleton count={4} height="h-32" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => {
                const sevProps = getSeverityBadgeProps(report.severity);
                const statProps = getStatusBadgeProps(report.status);

                return (
                  <Card
                    key={report.id}
                    hover
                    onClick={() => setSelectedReport(report)}
                    className="flex flex-col h-full border-sage-200/90 shadow-soft group"
                  >
                    {report.imageUrl && (
                      <div className="h-44 w-full overflow-hidden relative bg-sage-100">
                        <img
                          src={report.imageUrl}
                          alt={report.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className={`absolute top-3 left-3 text-[10px] font-black px-2.5 py-0.5 rounded-full border shadow-xs ${sevProps.bg}`}>
                          {sevProps.label}
                        </span>
                        <span className="absolute bottom-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white font-bold">
                          ~{report.estimatedKg} kg
                        </span>
                      </div>
                    )}

                    <CardBody className="flex-1 flex flex-col justify-between space-y-3 p-5">
                      <div>
                        <div className="flex items-center justify-between text-xs text-charcoal-400 font-mono mb-1.5">
                          <span className="font-bold text-forest-800">{report.id}</span>
                          <span>{formatDate(report.reportedAt)}</span>
                        </div>
                        <h3 className="font-extrabold text-sm text-charcoal-900 line-clamp-1 group-hover:text-forest-800 transition-colors">
                          {report.title}
                        </h3>
                        <p className="text-xs text-charcoal-600 line-clamp-2 mt-1 leading-relaxed">
                          {report.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-sage-100 text-xs space-y-2.5">
                        <div className="flex items-center gap-1.5 text-charcoal-500">
                          <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                          <span className="truncate">{report.address}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-forest-900 text-[11px] bg-forest-50 px-2 py-0.5 rounded border border-forest-100">
                            {getCategoryLabel(report.category)}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statProps.bg}`}>
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
          <div className="space-y-5 text-xs text-charcoal-700 font-sans">
            {selectedReport.imageUrl && (
              <div className="w-full h-64 rounded-2xl overflow-hidden bg-sage-100 border border-sage-200 shadow-soft relative group">
                <img
                  src={selectedReport.imageUrl}
                  alt={selectedReport.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-mono text-[10px]">
                  GPS: {selectedReport.latitude.toFixed(4)}°, {selectedReport.longitude.toFixed(4)}°
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-offwhite-200 border border-sage-200">
                <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">ID</span>
                <p className="font-mono font-black text-charcoal-900 text-xs mt-0.5">{selectedReport.id}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-offwhite-200 border border-sage-200">
                <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">Logged</span>
                <p className="font-bold text-charcoal-900 text-xs mt-0.5">{formatDate(selectedReport.reportedAt)}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-offwhite-200 border border-sage-200">
                <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">Material</span>
                <p className="font-bold text-forest-800 text-xs mt-0.5 truncate">{getCategoryLabel(selectedReport.category)}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-offwhite-200 border border-sage-200">
                <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">Est. Weight</span>
                <p className="font-black text-charcoal-900 text-xs mt-0.5 font-mono">~{selectedReport.estimatedKg} kg</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-charcoal-900 mb-1 text-xs">Incident Description</h4>
              <p className="leading-relaxed text-charcoal-700 bg-offwhite-100 p-3.5 rounded-xl border border-sage-200 text-xs">
                {selectedReport.description}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-forest-50 border border-forest-200 space-y-1">
              <span className="font-bold text-forest-900 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-limeaccent-600" />
                Image Analysis
              </span>
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
                Coordinates: {selectedReport.latitude.toFixed(4)}°, {selectedReport.longitude.toFixed(4)}°
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
