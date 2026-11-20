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
  Zap,
  Activity,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Plus,
  Navigation,
  Trash2,
  Globe,
  Building2,
  Check,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { hotspotService } from '../services/hotspotService';
import { cityPresets, initialMockHotspots } from '../data/mockHotspots';
import { getSeverityBadgeProps, getCategoryLabel } from '../utils/formatters';
import { formatDate, formatRelativeTime } from '../utils/dateUtils';

export function HotspotIntelligencePage() {
  const [hotspots, setHotspots] = useState([]);
  const [sortBy, setSortBy] = useState('priority'); // 'priority' | 'recurrence' | 'date'
  const [loading, setLoading] = useState(true);
  const [simulationActive, setSimulationActive] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'critical' | 'waterway'
  const [activeCityPreset, setActiveCityPreset] = useState('current');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState(null);
  const [geoLocating, setGeoLocating] = useState(false);

  // New Hotspot Form State
  const [formData, setFormData] = useState({
    name: '',
    district: '',
    latitude: 18.5204,
    longitude: 73.8567,
    radiusMeters: 250,
    recurrenceCount: 15,
    severity: 'high',
    priorityScore: 88,
    dominantCategory: 'plastic',
    environmentalRisk: 'High-density plastic accumulation along local waterway and pedestrian corridor',
    suggestedAction: 'Deploy high-capacity solar compactors and weekly municipal sanitation sweeps',
  });

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

  const handleCityPresetChange = async (cityKey) => {
    setActiveCityPreset(cityKey);
    setLoading(true);
    let targetList = initialMockHotspots;
    if (cityKey === 'pune') targetList = cityPresets.pune;
    else if (cityKey === 'mumbai') targetList = cityPresets.mumbai;
    else if (cityKey === 'delhi') targetList = cityPresets.delhi;
    else if (cityKey === 'sf') targetList = initialMockHotspots;

    await hotspotService.loadPreset(targetList);
    setHotspots(targetList);
    setLoading(false);
    showNotification(`Loaded ${targetList.length} real hotspots for ${cityKey.toUpperCase()}!`);
  };

  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setGeoLocating(false);
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`);
          if (res.ok) {
            const data = await res.json();
            const districtName = data.address?.suburb || data.address?.city_district || data.address?.city || 'Local Municipal Ward';
            setFormData((prev) => ({
              ...prev,
              district: districtName,
              name: prev.name || `${districtName} Waste Zone`,
            }));
          }
        } catch (e) {
          // Fallback to coordinates
        }
        showNotification('Acquired your exact GPS coordinates!');
      },
      (err) => {
        setGeoLocating(false);
        alert('Could not retrieve your location. Please enter coordinates manually.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCreateHotspot = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.latitude || !formData.longitude) {
      alert('Please provide a name, latitude, and longitude for the hotspot.');
      return;
    }

    try {
      const created = await hotspotService.createHotspot(formData);
      setIsAddModalOpen(false);
      loadHotspots();
      showNotification(`Created Hotspot: ${created.name}`);
      // Reset form
      setFormData({
        name: '',
        district: '',
        latitude: 18.5204,
        longitude: 73.8567,
        radiusMeters: 250,
        recurrenceCount: 15,
        severity: 'high',
        priorityScore: 88,
        dominantCategory: 'plastic',
        environmentalRisk: 'High-density plastic accumulation along local waterway and pedestrian corridor',
        suggestedAction: 'Deploy high-capacity solar compactors and weekly municipal sanitation sweeps',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteHotspot = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} (${id})?`)) return;
    try {
      await hotspotService.deleteHotspot(id);
      loadHotspots();
      showNotification(`Removed hotspot ${id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const showNotification = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const filteredHotspots = hotspots.filter((h) => {
    if (filterMode === 'critical') return h.priorityScore >= 80;
    if (filterMode === 'waterway') return h.environmentalRisk?.toLowerCase().includes('waterway') || h.environmentalRisk?.toLowerCase().includes('bay') || h.environmentalRisk?.toLowerCase().includes('river');
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#1B4332]/10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-900 mb-2 border border-rose-200 shadow-xs">
            <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
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
          <Button
            variant="pista"
            size="sm"
            icon={Plus}
            glow
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-full px-4 py-2 font-black shadow-md"
          >
            Add Real Hotspot
          </Button>

          <button
            onClick={() => setSimulationActive(!simulationActive)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all inline-flex items-center gap-2 border shadow-xs ${
              simulationActive
                ? 'bg-[#DEF5F1] text-[#092421] border-[#74D7CB] ring-2 ring-[#74D7CB]/40'
                : 'bg-white text-[#242D2B] border-[#1B4332]/15 hover:bg-[#FAF8F3]'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${simulationActive ? 'text-[#10241B]' : 'text-amber-500'}`} />
            <span>Remediation Simulator {simulationActive ? 'ACTIVE' : 'OFF'}</span>
          </button>

          <Link to="/map">
            <Button variant="outline" size="sm" icon={Compass} className="rounded-full px-4 py-2 font-bold">
              View on GIS Map
            </Button>
          </Link>
          <Link to="/cleanups">
            <Button variant="primary" size="sm" icon={ShieldAlert} className="rounded-full px-4 py-2 font-bold">
              Dispatch Squads
            </Button>
          </Link>
        </div>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-2xl bg-[#DEF5F1] border border-[#74D7CB] text-[#092421] text-xs font-bold flex items-center gap-2.5 shadow-soft animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Regional City Presets Quick Bar */}
      <div className="card-paper p-3 sm:p-4 rounded-[1.75rem] border border-[#1B4332]/15 flex flex-wrap items-center justify-between gap-3 shadow-soft">
        <div className="flex items-center gap-2 text-xs font-bold text-[#10241B]">
          <Globe className="w-4 h-4 text-[#2D6A4F]" />
          <span>Real-World Regional Datasets:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          {[
            { id: 'pune', name: 'Pune, India' },
            { id: 'mumbai', name: 'Mumbai, India' },
            { id: 'delhi', name: 'Delhi, India' },
            { id: 'sf', name: 'San Francisco, USA' },
          ].map((city) => (
            <button
              key={city.id}
              onClick={() => handleCityPresetChange(city.id)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                activeCityPreset === city.id
                  ? 'bg-[#102D27] text-[#74D7CB] border border-[#74D7CB]/60 font-bold shadow-xs'
                  : 'bg-white/80 text-[#242D2B] border border-[#1B4332]/15 hover:bg-white'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Algorithmic Methodology Banner */}
      <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#092421] via-[#123632] to-[#092421] text-white shadow-soft-lg overflow-hidden border border-[#27403C]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pista-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl text-xs">
            <span className="font-extrabold text-[#74D7CB] text-sm flex items-center gap-2 font-mono">
              <Layers className="w-4 h-4 text-[#74D7CB]" />
              PRIORITY SCORING METRIC (0 - 100 NORMALIZED SCALE)
            </span>
            <p className="text-pista-100/90 leading-relaxed text-xs">
              Autonomous score weighting: <code className="bg-[#051412] px-2 py-0.5 rounded text-[#74D7CB] font-mono text-[11px] border border-[#27403C]">Score = (Recurrence × 3.5) + (Material Hazard × 2.0) + (Waterway Runoff Buffer × 1.5)</code>.
              Clusters with scores $\ge 80$ automatically trigger mandatory municipal contractor dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#123632] px-4 py-2.5 rounded-2xl border border-[#27403C] text-xs text-pista-200 shrink-0 shadow-soft-xs">
            <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
            <div>
              <span className="text-[10px] uppercase font-bold text-pista-300 block">Critical Action Threshold</span>
              <span className="text-sm font-extrabold text-white">
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
            onClick={() => setFilterMode('waterway')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterMode === 'waterway'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-blue-800 border border-blue-200 hover:bg-blue-50'
            }`}
          >
            Waterway Runoff Risk
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
            const rawScore = hotspot.priorityScore;
            const simulatedScore = simulationActive ? Math.max(30, rawScore - 32) : rawScore;
            const isCritical = simulatedScore >= 80;
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
                      {simulatedScore}
                    </span>
                    <span className="text-[9px] text-charcoal-400 block font-mono">/ 100</span>

                    {simulationActive && (
                      <span className="text-[10px] font-bold text-botanical-700 font-mono block mt-0.5">
                        -32 pts
                      </span>
                    )}
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

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDeleteHotspot(hotspot.id, hotspot.name)}
                      className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                      title="Delete Hotspot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <Link
                      to="/map"
                      className="text-forest-800 hover:text-forest-950 font-bold inline-flex items-center gap-1 transition-colors text-xs"
                    >
                      Locate on GIS Map <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Real Hotspot Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Real-World Pollution Hotspot"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateHotspot} className="space-y-4 text-xs font-sans">
          <div className="p-3 bg-[#DEF5F1] rounded-xl border border-[#98E0D5] text-[#092421] flex items-center justify-between">
            <span className="font-semibold">Quickly pinpoint real locations:</span>
            <Button
              type="button"
              variant="pista"
              size="xs"
              icon={Navigation}
              loading={geoLocating}
              onClick={handleGetLiveLocation}
              className="rounded-full shadow-xs font-black text-xs"
            >
              Auto-Fill Live GPS Coordinates
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#10241B] mb-1">Hotspot Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mithi River Drainage Basin"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B4332]/20 bg-[#FAF8F3] text-[#12181A] font-medium focus:ring-2 focus:ring-[#74D7CB] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10241B] mb-1">District / Ward / Neighborhood</label>
              <input
                type="text"
                placeholder="e.g. Shivajinagar Ward 4"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B4332]/20 bg-[#FAF8F3] text-[#12181A] font-medium focus:ring-2 focus:ring-[#74D7CB] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#10241B] mb-1">Latitude *</label>
              <input
                type="number"
                step="any"
                required
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B4332]/20 bg-[#FAF8F3] text-[#12181A] font-mono font-bold focus:ring-2 focus:ring-[#74D7CB] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10241B] mb-1">Longitude *</label>
              <input
                type="number"
                step="any"
                required
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B4332]/20 bg-[#FAF8F3] text-[#12181A] font-mono font-bold focus:ring-2 focus:ring-[#74D7CB] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10241B] mb-1">Buffer Radius (m)</label>
              <input
                type="number"
                min="50"
                max="2000"
                value={formData.radiusMeters}
                onChange={(e) => setFormData({ ...formData, radiusMeters: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B4332]/20 bg-[#FAF8F3] text-[#12181A] font-mono focus:ring-2 focus:ring-[#74D7CB] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#10241B] mb-1">Dominant Material</label>
              <select
                value={formData.dominantCategory}
                onChange={(e) => setFormData({ ...formData, dominantCategory: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B4332]/20 bg-[#FAF8F3] text-[#12181A] font-medium outline-none"
              >
                <option value="plastic">Plastics & Packaging</option>
                <option value="glass">Glass & Bottles</option>
                <option value="metal">Metal & Scrap</option>
                <option value="hazardous">Hazardous / E-Waste</option>
                <option value="mixed">Mixed Waste</option>
                <option value="paper">Paper & Cardboard</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10241B] mb-1">Severity Rating</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B4332]/20 bg-[#FAF8F3] text-[#12181A] font-medium outline-none"
              >
                <option value="high">Critical (Tier 1)</option>
                <option value="medium">Moderate (Tier 2)</option>
                <option value="low">Low Impact (Tier 3)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10241B] mb-1">Priority Score (0-100)</label>
              <input
                type="number"
                min="10"
                max="100"
                value={formData.priorityScore}
                onChange={(e) => setFormData({ ...formData, priorityScore: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B4332]/20 bg-[#FAF8F3] text-[#12181A] font-mono font-bold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#10241B] mb-1">Ecological Vulnerability / Environmental Risk</label>
            <textarea
              rows="2"
              value={formData.environmentalRisk}
              onChange={(e) => setFormData({ ...formData, environmentalRisk: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B4332]/20 bg-[#FAF8F3] text-[#12181A] font-medium outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#10241B] mb-1">Recommended Municipal Action</label>
            <textarea
              rows="2"
              value={formData.suggestedAction}
              onChange={(e) => setFormData({ ...formData, suggestedAction: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B4332]/20 bg-[#FAF8F3] text-[#12181A] font-medium outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
              className="rounded-full px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="pista"
              size="sm"
              className="rounded-full px-5 py-2 font-black shadow-md"
            >
              Save Hotspot to Live Map
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
