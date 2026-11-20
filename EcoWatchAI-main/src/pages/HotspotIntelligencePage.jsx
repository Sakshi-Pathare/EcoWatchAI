import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  ArrowUpDown,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  ShieldAlert,
  SlidersHorizontal,
  Compass,
  Sparkles,
  Activity,
  CheckCircle2,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { hotspotService } from '../services/hotspotService';
import { getSeverityBadgeProps, getCategoryLabel } from '../utils/formatters';
import { formatDate, formatRelativeTime } from '../utils/dateUtils';
import { useAuth } from '../contexts/AuthContext';

export function HotspotIntelligencePage() {
  const { user } = useAuth();
  const [hotspots, setHotspots] = useState([]);
  const [sortBy, setSortBy] = useState('priority'); // 'priority' | 'recurrence' | 'date'
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'critical' | 'drainage'

  useEffect(() => {
    loadHotspots();
  }, [sortBy, user]);

  const loadHotspots = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = user && user.role !== 'citizen'
        ? await hotspotService.getHotspots(sortBy)
        : await hotspotService.getPublicHotspots(sortBy);
      setHotspots(data);
    } catch (e) {
      setLoadError(e.message || 'Unable to load hotspot data.');
    } finally {
      setLoading(false);
    }
  };

  const filteredHotspots = hotspots.filter((h) => {
    if (filterMode === 'critical') return h.priorityScore >= 80;
    if (filterMode === 'drainage') return h.environmentalRisk?.toLowerCase().includes('drainage');
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {loadError && (
        <div role="alert" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-center justify-between gap-3">
          <span>{loadError}</span>
          <Button variant="outline" size="sm" onClick={loadHotspots}>Retry</Button>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#1B4332]/10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-900 mb-2 border border-rose-200 shadow-xs">
            <Flame className="w-3.5 h-3.5 text-rose-700" />
            <span>Algorithmic Hotspot Clustering Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#10241B] tracking-tight">
            Hotspot Intelligence & Priority Ranking
          </h1>
          <p className="text-xs sm:text-sm text-[#556E55] mt-1 max-w-2xl leading-relaxed font-medium">
            Automated geospatial recurrence clustering. High-frequency dumping corridors ranked by dynamic multi-parameter Cleanup Priority Score.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/map">
            <Button variant="outline" size="sm" icon={Compass} className="px-4 py-2">
              View on GIS Map
            </Button>
          </Link>
          <Link to="/cleanups">
            <Button variant="pista" size="sm" icon={ShieldAlert} className="px-4 py-2">
              Dispatch Squads
            </Button>
          </Link>
        </div>
      </div>

      {/* Algorithmic Methodology Banner */}
      <div className="rounded-2xl p-6 sm:p-7 bg-forest-50 text-charcoal-800 overflow-hidden border border-forest-100">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl text-xs">
            <span className="font-bold text-forest-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-forest-700" />
              PRIORITY SCORING METRIC (0 - 100 NORMALIZED SCALE)
            </span>
            <p className="text-charcoal-700 leading-relaxed text-xs">
              Priority combines average report severity, a recurrence bonus for additional nearby reports, and an age adjustment, capped at 100.
              Scores of 80 or higher flag a cluster for municipal review; dispatch remains a manual action.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-sage-200 text-xs text-charcoal-700 shrink-0">
            <Flame className="w-5 h-5 text-rose-700" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-charcoal-500 block">Critical Action Threshold</span>
              <span className="text-sm font-bold text-charcoal-900">
                {hotspots.filter((h) => h.priorityScore >= 80).length} High-Risk Corridors
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Chips & Sorting Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-sage-200 shadow-soft">
        {/* Preset filter chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-charcoal-500 text-[11px] uppercase mr-1">Filter Clusters:</span>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-white text-charcoal-700 border border-sage-200 hover:bg-offwhite-100'
            }`}
          >
            All Clusters ({hotspots.length})
          </button>
          <button
            onClick={() => setFilterMode('critical')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterMode === 'critical'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-rose-800 border border-rose-200 hover:bg-rose-50'
            }`}
          >
            Critical Score $\ge 80$ ({hotspots.filter(h => h.priorityScore >= 80).length})
          </button>
          <button
            onClick={() => setFilterMode('drainage')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterMode === 'drainage'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-blue-800 border border-blue-200 hover:bg-blue-50'
            }`}
          >
            Drainage Risk
          </button>
        </div>

        {/* Sorting buttons */}
        <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-700 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-forest-700" />
          <span className="text-[11px] text-charcoal-400">Sort:</span>
          <div className="inline-flex rounded-xl border border-sage-300 bg-beige-50 p-0.5 shadow-xs">
            <button
              onClick={() => setSortBy('priority')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                sortBy === 'priority'
                  ? 'bg-[#092421] text-[#74D7CB] shadow-xs'
                  : 'text-charcoal-700 hover:text-darkgreen-950'
              }`}
            >
              Priority
            </button>
            <button
              onClick={() => setSortBy('recurrence')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                sortBy === 'recurrence'
                  ? 'bg-[#092421] text-[#74D7CB] shadow-xs'
                  : 'text-charcoal-700 hover:text-darkgreen-950'
              }`}
            >
              Recurrence
            </button>
            <button
              onClick={() => setSortBy('date')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                sortBy === 'date'
                  ? 'bg-[#092421] text-[#74D7CB] shadow-xs'
                  : 'text-charcoal-700 hover:text-darkgreen-950'
              }`}
            >
              Recent
            </button>
          </div>
        </div>
      </div>

      {/* Hotspots Grid */}
      {loading ? (
        <LoadingSkeleton count={3} height="h-48" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHotspots.map((hotspot, idx) => {
            const isCritical = hotspot.priorityScore >= 80;
            const sevProps = getSeverityBadgeProps(hotspot.severity);

            return (
              <Card
                key={hotspot.id}
                className={`p-6 space-y-4 border transition-all duration-300 shadow-soft hover:shadow-soft-md group ${
                  isCritical
                    ? 'border-l-4 border-l-rose-500 hover:border-rose-400'
                    : 'border-l-4 border-l-amber-500 hover:border-amber-400'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded-md bg-sage-100 text-charcoal-800">
                        RANK #{idx + 1} • {hotspot.id}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${sevProps.bg}`}>
                        {sevProps.label}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-charcoal-900 group-hover:text-forest-900 transition-colors">
                      {hotspot.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-charcoal-500">
                      <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                      <span className="font-medium">{hotspot.district}</span>
                      <span className="text-charcoal-300">•</span>
                      <span className="font-mono text-[11px]">Radius: ~{hotspot.radiusMeters}m</span>
                    </div>
                  </div>

                  {/* Priority Gauge Badge */}
                  <div className="text-center p-3 rounded-2xl bg-beige-100/90 border border-beige-300 shrink-0 min-w-[76px] shadow-xs">
                    <span className="text-[9px] uppercase font-bold text-charcoal-400 block tracking-wider">Priority</span>
                    <span
                      className={`text-2xl font-black font-mono transition-all duration-500 ${
                        isCritical ? 'text-rose-600' : 'text-amber-600'
                      }`}
                    >
                      {hotspot.priorityScore}
                    </span>
                    <span className="text-[9px] text-charcoal-400 block font-mono">/ 100</span>
                  </div>
                </div>

                {/* Key Metrics Breakdown */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-beige-100/70 border border-beige-200/90 text-xs">
                  <div>
                    <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">Recurrence</span>
                    <span className="font-extrabold text-charcoal-900 font-mono text-xs">{hotspot.recurrenceCount} Reports</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">Primary Material</span>
                    <span className="font-bold text-darkgreen-900 text-xs truncate block">{getCategoryLabel(hotspot.dominantCategory)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">Trend</span>
                    <span className="font-extrabold text-rose-600 font-mono text-xs">{hotspot.trend}</span>
                  </div>
                </div>

                {/* Environmental Risk & Recommended Action */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-charcoal-800">Ecological Vulnerability:</span>
                    <p className="text-charcoal-600 text-[11px] mt-0.5 leading-relaxed font-medium">
                      {hotspot.environmentalRisk}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-forest-50/90 border border-forest-200 text-forest-950 space-y-1">
                    <span className="font-extrabold text-[11px] flex items-center gap-1.5 text-forest-900">
                      <ShieldAlert className="w-3.5 h-3.5 text-forest-700" />
                      Recommended Municipal Intervention:
                    </span>
                    <p className="text-[11px] text-forest-800 leading-relaxed font-medium">
                      {hotspot.suggestedAction}
                    </p>
                  </div>
                </div>

                {/* Footer Coordinates & Date */}
                <div className="pt-3 border-t border-sage-100 flex items-center justify-between text-xs text-charcoal-500">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                    Last logged: {formatDate(hotspot.lastReportedDate)}
                  </span>

                  <Link
                    to="/map"
                    className="text-forest-800 hover:text-forest-950 font-bold inline-flex items-center gap-1 transition-colors text-xs"
                  >
                    Locate on GIS Map <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
