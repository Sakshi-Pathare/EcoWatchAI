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
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { hotspotService } from '../services/hotspotService';
import { getSeverityBadgeProps, getCategoryLabel } from '../utils/formatters';
import { formatDate, formatRelativeTime } from '../utils/dateUtils';

export function HotspotIntelligencePage() {
  const [hotspots, setHotspots] = useState([]);
  const [sortBy, setSortBy] = useState('priority'); // 'priority' | 'recurrence' | 'date'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHotspots();
  }, [sortBy]);

  const loadHotspots = async () => {
    setLoading(true);
    try {
      const data = await hotspotService.getHotspots(sortBy);
      setHotspots(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-sage-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 mb-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>Algorithmic Hotspot Clustering</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Hotspot Intelligence & Priority Ranking
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1 max-w-2xl">
            Automated geospatial recurrence clustering. High-frequency dumping zones ranked by calculated Cleanup Priority Score.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/map">
            <Button variant="outline" size="sm" icon={Compass}>
              View on GIS Map
            </Button>
          </Link>
          <Link to="/cleanups">
            <Button variant="primary" size="sm" icon={ShieldAlert}>
              Dispatch Cleanups
            </Button>
          </Link>
        </div>
      </div>

      {/* Algorithmic Methodology Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-forest-900 to-forest-800 text-white shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl text-xs">
          <span className="font-bold text-limeaccent-300 text-sm flex items-center gap-1.5">
            <Layers className="w-4 h-4" /> Priority Scoring Formula (0 - 100 Scale)
          </span>
          <p className="text-sage-200 leading-relaxed text-[11px]">
            Score is computed via: <code className="bg-forest-950 px-1.5 py-0.5 rounded text-limeaccent-300 font-mono">Priority = (Recurrence × 3.5) + (Material Hazard × 2.0) + (Waterway Proximity × 1.5)</code>.
            Clusters exceeding score 80 trigger urgent municipal remediation dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-forest-950/60 px-3 py-2 rounded-xl border border-forest-700 text-xs text-sage-200 shrink-0">
          <Flame className="w-4 h-4 text-rose-400" />
          <span><b>{hotspots.filter((h) => h.priorityScore >= 80).length}</b> Critical Zones Requiring Action</span>
        </div>
      </div>

      {/* Sorting & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-charcoal-700">
          <ArrowUpDown className="w-4 h-4 text-forest-700" />
          <span>Sort Ranked Zones By:</span>
          <div className="inline-flex rounded-lg border border-sage-300 bg-white p-0.5">
            <button
              onClick={() => setSortBy('priority')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                sortBy === 'priority'
                  ? 'bg-forest text-white'
                  : 'text-charcoal-600 hover:text-forest-900'
              }`}
            >
              Priority Score
            </button>
            <button
              onClick={() => setSortBy('recurrence')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                sortBy === 'recurrence'
                  ? 'bg-forest text-white'
                  : 'text-charcoal-600 hover:text-forest-900'
              }`}
            >
              Report Recurrence
            </button>
            <button
              onClick={() => setSortBy('date')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                sortBy === 'date'
                  ? 'bg-forest text-white'
                  : 'text-charcoal-600 hover:text-forest-900'
              }`}
            >
              Most Recent Incident
            </button>
          </div>
        </div>

        <span className="text-xs text-charcoal-500 font-medium">
          Showing <b>{hotspots.length}</b> detected urban clusters
        </span>
      </div>

      {/* Hotspots Grid */}
      {loading ? (
        <LoadingSkeleton count={3} height="h-44" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotspots.map((hotspot, idx) => {
            const isCritical = hotspot.priorityScore >= 80;
            const sevProps = getSeverityBadgeProps(hotspot.severity);

            return (
              <Card
                key={hotspot.id}
                className={`p-6 space-y-4 border transition-all ${
                  isCritical ? 'border-l-4 border-l-rose-500 hover:border-rose-300' : 'hover:border-sage-300'
                }`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sage-100 text-charcoal-700">
                        #{idx + 1} • {hotspot.id}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sevProps.bg}`}>
                        {sevProps.label}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-charcoal-900">{hotspot.name}</h3>

                    <div className="flex items-center gap-1.5 text-xs text-charcoal-500">
                      <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                      <span>{hotspot.district}</span>
                      <span className="text-charcoal-300">•</span>
                      <span>Radius: ~{hotspot.radiusMeters}m</span>
                    </div>
                  </div>

                  {/* Priority Gauge Badge */}
                  <div className="text-center p-2.5 rounded-xl bg-offwhite-200 border border-sage-200 shrink-0 min-w-[70px]">
                    <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Score</span>
                    <span
                      className={`text-2xl font-black ${
                        isCritical ? 'text-rose-600' : 'text-amber-600'
                      }`}
                    >
                      {hotspot.priorityScore}
                    </span>
                    <span className="text-[9px] text-charcoal-400 block">/ 100</span>
                  </div>
                </div>

                {/* Key Metrics Breakdown */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-offwhite-100 border border-sage-200 text-xs">
                  <div>
                    <span className="text-[10px] text-charcoal-400 font-medium block">Recurrence</span>
                    <span className="font-bold text-charcoal-900">{hotspot.recurrenceCount} Reports</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-400 font-medium block">Primary Waste</span>
                    <span className="font-bold text-forest-800">{getCategoryLabel(hotspot.dominantCategory)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-400 font-medium block">Trend</span>
                    <span className="font-bold text-rose-600">{hotspot.trend}</span>
                  </div>
                </div>

                {/* Environmental Risk & Recommended Action */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-charcoal-700">Ecological Risk:</span>
                    <p className="text-charcoal-600 text-[11px] mt-0.5">{hotspot.environmentalRisk}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-forest-50 border border-forest-200 text-forest-900">
                    <span className="font-bold text-[11px] flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-forest-700" />
                      Recommended Municipal Intervention:
                    </span>
                    <p className="text-[11px] text-forest-800 mt-1">{hotspot.suggestedAction}</p>
                  </div>
                </div>

                {/* Footer Coordinates & Date */}
                <div className="pt-3 border-t border-sage-100 flex items-center justify-between text-xs text-charcoal-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-charcoal-400" />
                    Last incident: {formatDate(hotspot.lastReportedDate)} ({formatRelativeTime(hotspot.lastReportedDate)})
                  </span>

                  <Link
                    to="/map"
                    className="text-forest-700 hover:text-forest-900 font-semibold inline-flex items-center gap-1"
                  >
                    Locate on Map
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

