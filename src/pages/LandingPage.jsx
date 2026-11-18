import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Camera,
  Layers,
  ArrowRight,
  ShieldCheck,
  Flame,
  CheckCircle2,
  TrendingDown,
  BarChart3,
  Sparkles,
  Users,
  Compass,
  Radio,
  Zap,
  Activity,
  Award,
  Globe2,
  Cpu,
  Clock,
  Eye,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { analyticsService } from '../services/analyticsService';
import { formatNumber } from '../utils/formatters';

export function LandingPage() {
  const [metrics, setMetrics] = useState(null);
  const [activeTelemetryTab, setActiveTelemetryTab] = useState('hotspot'); // 'hotspot' | 'detection' | 'dispatch'

  useEffect(() => {
    analyticsService.getDashboardMetrics().then(setMetrics);
  }, []);

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* Hero Section with Mesh Glow & Dot Grid */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-forest-50/70 via-offwhite-100 to-offwhite-100 border-b border-sage-200/80 bg-grid-pattern">
        {/* Ambient lighting spheres */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-forest-200/40 via-limeaccent-200/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-forest-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-limeaccent-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Heading, Telemetry Pill & CTAs */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
              {/* Telemetry pill */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-forest-200 shadow-soft-xs backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-limeaccent-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-limeaccent-600" />
                </span>
                <span className="text-xs font-bold text-forest-900 tracking-tight">
                  Next-Gen Civic Environmental Intelligence Platform
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-forest-100 text-forest-800 font-bold hidden sm:inline">
                  v2.4 GIS
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-forest-950 tracking-tight leading-[1.1] font-sans">
                Turn Public Litter into{' '}
                <span className="text-gradient-forest underline decoration-limeaccent-400 decoration-wavy decoration-2">
                  Actionable Hotspot
                </span>{' '}
                Intelligence.
              </h1>

              {/* Subtext */}
              <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed max-w-2xl font-normal">
                EcoWatch AI equips municipal sanitation crews and civic volunteers with crowdsourced photographic reports, automated recurrence clustering, and verified before-and-after resolution audits.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link to="/report">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={Camera}
                    glow
                    className="w-full sm:w-auto shadow-md"
                  >
                    Report Litter Incident
                  </Button>
                </Link>
                <Link to="/map">
                  <Button
                    variant="outline"
                    size="lg"
                    icon={Compass}
                    className="w-full sm:w-auto hover:bg-white"
                  >
                    Explore Pollution GIS Map
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-sage-200/90 flex flex-wrap items-center gap-5 sm:gap-8 text-xs text-charcoal-500 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-charcoal-700">100% Software Architecture</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-charcoal-700">OpenStreetMap GIS Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-charcoal-700">FastAPI & YOLOv8 Ready</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Telemetry HUD Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual glow backdrop */}
                <div className="absolute -inset-1 bg-gradient-to-r from-forest-600 via-limeaccent-500 to-forest-700 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-1000 animate-pulse-subtle" />

                <div className="relative bg-white/95 rounded-2xl border border-sage-300 shadow-soft-xl overflow-hidden backdrop-blur-xl">
                  {/* Card Telemetry Header */}
                  <div className="px-5 py-3.5 bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white flex items-center justify-between text-xs border-b border-forest-800">
                    <div className="flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-limeaccent-400 animate-pulse" />
                      <span className="font-bold tracking-wide uppercase font-mono text-[11px]">
                        Live Municipal Telemetry
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-limeaccent-300 font-bold bg-forest-800/80 px-2 py-0.5 rounded-full border border-forest-700">
                      GRID: SF-37.77N
                    </span>
                  </div>

                  {/* Telemetry Tabs */}
                  <div className="grid grid-cols-3 bg-offwhite-200/90 p-1 border-b border-sage-200 text-xs">
                    <button
                      onClick={() => setActiveTelemetryTab('hotspot')}
                      className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all ${
                        activeTelemetryTab === 'hotspot'
                          ? 'bg-white text-forest-900 shadow-xs'
                          : 'text-charcoal-500 hover:text-charcoal-800'
                      }`}
                    >
                      Hotspot Radar
                    </button>
                    <button
                      onClick={() => setActiveTelemetryTab('detection')}
                      className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all ${
                        activeTelemetryTab === 'detection'
                          ? 'bg-white text-forest-900 shadow-xs'
                          : 'text-charcoal-500 hover:text-charcoal-800'
                      }`}
                    >
                      AI Vision
                    </button>
                    <button
                      onClick={() => setActiveTelemetryTab('dispatch')}
                      className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all ${
                        activeTelemetryTab === 'dispatch'
                          ? 'bg-white text-forest-900 shadow-xs'
                          : 'text-charcoal-500 hover:text-charcoal-800'
                      }`}
                    >
                      Squad Dispatch
                    </button>
                  </div>

                  {/* Tab Body Content */}
                  <div className="p-5 space-y-4">
                    {activeTelemetryTab === 'hotspot' && (
                      <div className="space-y-3 animate-fadeIn">
                        {/* High Priority Cluster */}
                        <div className="p-3.5 rounded-xl bg-rose-50/90 border border-rose-200 flex items-start gap-3 shadow-xs">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <Flame className="w-5 h-5 text-rose-100" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-xs font-bold text-rose-950 truncate">
                                Mission Creek Drainage Corridor
                              </h4>
                              <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-rose-200 text-rose-900 shrink-0">
                                SCORE 94
                              </span>
                            </div>
                            <p className="text-[11px] text-rose-800 mt-0.5 leading-snug">
                              24 recurring dumps. Critical plastic runoff risk to marine buffer.
                            </p>
                          </div>
                        </div>

                        {/* Moderate Cluster */}
                        <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 flex items-start gap-3 shadow-xs">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <MapPin className="w-5 h-5 text-amber-100" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-xs font-bold text-amber-950 truncate">
                                Civic Center Plaza Pedestrian Zone
                              </h4>
                              <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 shrink-0">
                                SCORE 89
                              </span>
                            </div>
                            <p className="text-[11px] text-amber-800 mt-0.5 leading-snug">
                              19 incidents recorded. Overflowing pedestrian bins along corridor.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTelemetryTab === 'detection' && (
                      <div className="space-y-3 animate-fadeIn text-xs">
                        <div className="p-3 rounded-xl bg-forest-50 border border-forest-200 space-y-2">
                          <div className="flex items-center justify-between font-mono text-[11px]">
                            <span className="font-bold text-forest-900 flex items-center gap-1.5">
                              <Cpu className="w-3.5 h-3.5 text-limeaccent-600" />
                              YOLOv8 Inference Pipeline (Staged)
                            </span>
                            <span className="text-forest-700 font-bold">98.4% Conf</span>
                          </div>
                          <div className="space-y-1.5 text-[11px] text-charcoal-700">
                            <div className="flex justify-between">
                              <span>PET Beverage Plastics:</span>
                              <span className="font-bold font-mono">14 Items (82%)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Aluminum Scrap / Cans:</span>
                              <span className="font-bold font-mono">6 Items (18%)</span>
                            </div>
                            <div className="w-full h-1.5 bg-forest-200 rounded-full overflow-hidden">
                              <div className="h-full bg-forest-700 rounded-full w-[82%]" />
                            </div>
                          </div>
                        </div>
                        <p className="text-[11px] text-charcoal-500 leading-snug">
                          Autonomous material classification triggers in Phase 2 upon photo upload.
                        </p>
                      </div>
                    )}

                    {activeTelemetryTab === 'dispatch' && (
                      <div className="space-y-3 animate-fadeIn text-xs">
                        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
                          <div className="flex items-center justify-between font-mono text-[11px]">
                            <span className="font-bold text-blue-950 flex items-center gap-1.5">
                              <Activity className="w-3.5 h-3.5 text-blue-600" />
                              Squad Alpha Active Deployment
                            </span>
                            <span className="text-blue-700 font-bold">In Transit</span>
                          </div>
                          <p className="text-[11px] text-blue-800">
                            Destination: Buena Vista Park Lawn • ETA: 18 mins • Work Order #CLN-803
                          </p>
                        </div>
                        <p className="text-[11px] text-charcoal-500 leading-snug">
                          Automated work orders dispatched with verified GPS navigation coordinates.
                        </p>
                      </div>
                    )}

                    {/* Bottom Response Metrics Strip */}
                    <div className="p-3.5 rounded-xl bg-forest-50/80 border border-forest-200 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-charcoal-500 font-semibold block">
                          District Response Efficiency
                        </span>
                        <p className="text-lg font-black text-forest-950 font-mono">
                          94.2% within 24h
                        </p>
                      </div>
                      <Link to="/hotspots">
                        <Button variant="lime" size="xs" icon={ArrowRight} iconPosition="right">
                          Intel Hub
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Impact Statistics Section with Glowing Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="forest" dot pulse dotColor="bg-limeaccent-600" className="mb-2.5">
            Verified Municipal Impact Telemetry
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
            Real-Time Community Outcomes
          </h2>
          <p className="text-sm text-charcoal-600 mt-2 leading-relaxed">
            Every submission directly updates municipal sanitation priority scores, ensuring crews are deployed where ecological risk is highest.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card hover className="p-6 text-center group border-sage-200/90 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center mx-auto mb-3.5 border border-forest-200/80 shadow-xs transition-transform duration-300 group-hover:scale-110">
              <Layers className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-forest-950 tracking-tight font-sans">
              {formatNumber(metrics?.totalReportsLogged || 469)}
            </div>
            <p className="text-xs font-bold text-charcoal-800 mt-1">Pollution Incidents Logged</p>
            <p className="text-[11px] text-forest-700 font-semibold mt-0.5 font-mono">+14% MoM Civic Volume</p>
          </Card>

          <Card hover className="p-6 text-center group border-sage-200/90 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-limeaccent-100 text-limeaccent-900 flex items-center justify-center mx-auto mb-3.5 border border-limeaccent-300 shadow-xs transition-transform duration-300 group-hover:scale-110">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-forest-950 tracking-tight font-sans">
              {formatNumber(metrics?.completedCleanups || 391)}
            </div>
            <p className="text-xs font-bold text-charcoal-800 mt-1">Certified Cleanups</p>
            <p className="text-[11px] text-forest-700 font-semibold mt-0.5 font-mono">83.3% Full Resolution</p>
          </Card>

          <Card hover className="p-6 text-center group border-sage-200/90 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3.5 border border-emerald-200/80 shadow-xs transition-transform duration-300 group-hover:scale-110">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-forest-950 tracking-tight font-sans">
              {formatNumber(metrics?.totalWasteCollectedKg || 4280)} <span className="text-lg font-bold">kg</span>
            </div>
            <p className="text-xs font-bold text-charcoal-800 mt-1">Litter Diverted from Waters</p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5 font-mono">~2.4 Tons CO₂ Offset</p>
          </Card>

          <Card hover className="p-6 text-center group border-sage-200/90 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3.5 border border-amber-200/80 shadow-xs transition-transform duration-300 group-hover:scale-110">
              <Flame className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-forest-950 tracking-tight font-sans">
              {metrics?.activeHotspotsTracked || 6}
            </div>
            <p className="text-xs font-bold text-charcoal-800 mt-1">Active Clusters Mapped</p>
            <p className="text-[11px] text-amber-700 font-semibold mt-0.5 font-mono">Targeted for Remediation</p>
          </Card>
        </div>
      </section>

      {/* 4-Step Operational Workflow with Laser Connection Lines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-sage-200/90 p-8 sm:p-12 lg:p-16 shadow-soft relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-limeaccent-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto mb-14 relative z-10">
            <Badge variant="sage" className="mb-2.5">
              Structured Operations
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
              The Civic-to-Municipal Pipeline
            </h2>
            <p className="text-sm text-charcoal-600 mt-2">
              From civic capture to certified photographic completion in four systematic steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="relative group space-y-3.5 p-5 rounded-2xl bg-offwhite-50 border border-sage-200/70 hover:border-forest-400 transition-all duration-300 hover:shadow-soft-md">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-800 to-forest-700 text-limeaccent-300 flex items-center justify-center font-black text-lg shadow-soft-sm group-hover:scale-105 transition-transform">
                01
              </div>
              <h3 className="font-bold text-base text-charcoal-900">Capture & Geotag</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Citizens submit photographic evidence. Accurate coordinates are tagged using Leaflet interactive pins or mobile GPS.
              </p>
              <div className="pt-2 text-[11px] font-mono font-bold text-forest-700 flex items-center gap-1">
                <span>EXIF GPS Sync</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group space-y-3.5 p-5 rounded-2xl bg-offwhite-50 border border-sage-200/70 hover:border-forest-400 transition-all duration-300 hover:shadow-soft-md">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-800 to-forest-700 text-limeaccent-300 flex items-center justify-center font-black text-lg shadow-soft-sm group-hover:scale-105 transition-transform">
                02
              </div>
              <h3 className="font-bold text-base text-charcoal-900">Hotspot Clustering</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Geospatial algorithms aggregate reports to detect repeat dump zones and calculate multi-factor priority scores.
              </p>
              <div className="pt-2 text-[11px] font-mono font-bold text-forest-700 flex items-center gap-1">
                <span>DBSCAN Density Engine</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group space-y-3.5 p-5 rounded-2xl bg-offwhite-50 border border-sage-200/70 hover:border-forest-400 transition-all duration-300 hover:shadow-soft-md">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-800 to-forest-700 text-limeaccent-300 flex items-center justify-center font-black text-lg shadow-soft-sm group-hover:scale-105 transition-transform">
                03
              </div>
              <h3 className="font-bold text-base text-charcoal-900">Municipal Dispatch</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Sanitation authorities allocate prioritized work orders to specialized cleanup crews with volume estimates.
              </p>
              <div className="pt-2 text-[11px] font-mono font-bold text-forest-700 flex items-center gap-1">
                <span>Contractor Work Orders</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative group space-y-3.5 p-5 rounded-2xl bg-offwhite-50 border border-sage-200/70 hover:border-forest-400 transition-all duration-300 hover:shadow-soft-md">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-800 to-forest-700 text-limeaccent-300 flex items-center justify-center font-black text-lg shadow-soft-sm group-hover:scale-105 transition-transform">
                04
              </div>
              <h3 className="font-bold text-base text-charcoal-900">Photographic Audit</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Field teams upload post-remediation photographs for side-by-side verification and civic transparency.
              </p>
              <div className="pt-2 text-[11px] font-mono font-bold text-forest-700 flex items-center gap-1">
                <span>Before/After Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Traditional vs EcoWatch AI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <Badge variant="lime">Intelligent Paradigm Shift</Badge>
            <h2 className="text-3xl font-extrabold text-charcoal-900 tracking-tight leading-snug">
              Why Cities Choose EcoWatch AI Over Manual Audits
            </h2>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              Traditional municipal street maintenance relies on delayed telephone hotlines and scheduled sweeps that miss chronic illegal dumping. EcoWatch AI provides autonomous spatial recurrence intelligence.
            </p>
            <div className="pt-2">
              <Link to="/hotspots">
                <Button variant="outline" size="sm" icon={Flame}>
                  Explore Hotspot Scoring Formula
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Legacy Approach */}
              <div className="p-6 rounded-2xl bg-white border border-rose-200/80 shadow-soft space-y-3">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                  ✕
                </div>
                <h4 className="font-bold text-base text-rose-950">Traditional City Operations</h4>
                <ul className="space-y-2 text-xs text-charcoal-600">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>Random patrol sweeps without density data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>Slow 5-10 day phone reporting latency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>Zero photographic verification audits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>Repeat dump sites go unmonitored</span>
                  </li>
                </ul>
              </div>

              {/* EcoWatch AI Approach */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-forest-50 to-white border-2 border-forest-500 shadow-soft-md space-y-3 relative overflow-hidden">
                <span className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-limeaccent-200 text-limeaccent-900 border border-limeaccent-400">
                  RECOMMENDED
                </span>
                <div className="w-8 h-8 rounded-lg bg-forest-800 text-limeaccent-300 flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <h4 className="font-bold text-base text-forest-950">EcoWatch AI Platform</h4>
                <ul className="space-y-2 text-xs text-charcoal-700">
                  <li className="flex items-start gap-2">
                    <span className="text-forest-700 font-bold">✓</span>
                    <span>Automated hotspot density clustering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-forest-700 font-bold">✓</span>
                    <span>Under 24-hour dispatch resolution rate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-forest-700 font-bold">✓</span>
                    <span>Side-by-side photographic certification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-forest-700 font-bold">✓</span>
                    <span>Multi-factor priority score algorithm</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner with High-Contrast Sheen */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 text-white text-center overflow-hidden bg-gradient-to-br from-forest-950 via-forest-900 to-forest-900 border border-forest-800 shadow-soft-xl">
          {/* Ambient lighting inside CTA */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-limeaccent-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-forest-600/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-800/80 border border-forest-700 text-limeaccent-300 font-mono text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Start Safeguarding Your Community
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Protect Your Local Environment with Precision AI?
            </h2>

            <p className="text-sage-200 text-sm leading-relaxed">
              Join active civic reporters, municipal sanitation managers, and environmental teams mapping public pollution and accelerating cleanups.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/report">
                <Button variant="lime" size="lg" icon={Camera} glow className="shadow-lg">
                  Submit a Litter Report Now
                </Button>
              </Link>
              <Link to="/map">
                <Button
                  variant="outline"
                  size="lg"
                  icon={Compass}
                  className="border-forest-700 text-white bg-forest-800/80 hover:bg-forest-700"
                >
                  Explore Live Pollution Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
