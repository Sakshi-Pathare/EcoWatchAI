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
    <div className="space-y-24 sm:space-y-32 pb-24 font-sans">
      {/* Hero Section with Warm Beige + Sage + Dark Green Mesh */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-beige-100 via-beige-50 to-beige-100 border-b border-beige-300/80 bg-grid-pattern">
        {/* Ambient lighting spheres in sage & warm sand */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-sage-200/40 via-beige-200/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-darkgreen-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-sage-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Heading, Telemetry Pill & CTAs */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
              {/* Telemetry pill */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-sage-300 shadow-soft-xs backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-botanical-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-botanical-600" />
                </span>
                <span className="text-xs font-bold text-darkgreen-950 tracking-tight">
                  Civic Environmental Intelligence & Hotspot Cartography
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sage-100 text-darkgreen-900 font-bold hidden sm:inline">
                  v2.4 GIS
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-darkgreen-950 tracking-tight leading-[1.1] font-sans">
                Turn Public Litter into{' '}
                <span className="text-gradient-forest underline decoration-sage-500 decoration-wavy decoration-2">
                  Actionable Hotspot
                </span>{' '}
                Intelligence.
              </h1>

              {/* Subtext */}
              <p className="text-base sm:text-lg text-charcoal-700 leading-relaxed max-w-2xl font-medium">
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
                    className="w-full sm:w-auto shadow-md bg-darkgreen-800 hover:bg-darkgreen-900 text-beige-50"
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
              <div className="pt-6 border-t border-beige-300 flex flex-wrap items-center gap-5 sm:gap-8 text-xs text-sage-700 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-sage-100 text-darkgreen-800 flex items-center justify-center shrink-0 border border-sage-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-darkgreen-950">100% Software Architecture</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-sage-100 text-darkgreen-800 flex items-center justify-center shrink-0 border border-sage-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-darkgreen-950">OpenStreetMap GIS Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-sage-100 text-darkgreen-800 flex items-center justify-center shrink-0 border border-sage-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-darkgreen-950">FastAPI & YOLOv8 Ready</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Telemetry HUD Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual glow backdrop in darkgreen & sage */}
                <div className="absolute -inset-1 bg-gradient-to-r from-darkgreen-800 via-botanical-600 to-sage-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-50 transition duration-1000 animate-pulse-subtle" />

                <div className="relative bg-[#FAF8F5] rounded-3xl border border-beige-300 shadow-soft-xl overflow-hidden backdrop-blur-xl">
                  {/* Card Telemetry Header (Deep Dark Green) */}
                  <div className="px-5 py-3.5 bg-gradient-to-r from-darkgreen-950 via-darkgreen-900 to-darkgreen-950 text-beige-100 flex items-center justify-between text-xs border-b border-darkgreen-800">
                    <div className="flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-limeaccent-400 animate-pulse" />
                      <span className="font-bold tracking-wide uppercase font-mono text-[11px]">
                        Live Municipal Telemetry
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-limeaccent-300 font-bold bg-darkgreen-800/80 px-2 py-0.5 rounded-full border border-darkgreen-700">
                      GRID: SF-37.77N
                    </span>
                  </div>

                  {/* Telemetry Tabs (Warm Beige Container) */}
                  <div className="grid grid-cols-3 bg-beige-200/90 p-1 border-b border-beige-300 text-xs font-bold">
                    <button
                      onClick={() => setActiveTelemetryTab('hotspot')}
                      className={`py-1.5 px-2 rounded-xl text-[11px] transition-all ${
                        activeTelemetryTab === 'hotspot'
                          ? 'bg-white text-darkgreen-950 shadow-xs'
                          : 'text-sage-700 hover:text-darkgreen-900'
                      }`}
                    >
                      Hotspot Radar
                    </button>
                    <button
                      onClick={() => setActiveTelemetryTab('detection')}
                      className={`py-1.5 px-2 rounded-xl text-[11px] transition-all ${
                        activeTelemetryTab === 'detection'
                          ? 'bg-white text-darkgreen-950 shadow-xs'
                          : 'text-sage-700 hover:text-darkgreen-900'
                      }`}
                    >
                      AI Vision
                    </button>
                    <button
                      onClick={() => setActiveTelemetryTab('dispatch')}
                      className={`py-1.5 px-2 rounded-xl text-[11px] transition-all ${
                        activeTelemetryTab === 'dispatch'
                          ? 'bg-white text-darkgreen-950 shadow-xs'
                          : 'text-sage-700 hover:text-darkgreen-900'
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
                        <div className="p-3.5 rounded-2xl bg-rose-50/90 border border-rose-200 flex items-start gap-3 shadow-xs">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <Flame className="w-5 h-5 text-rose-100" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-xs font-extrabold text-rose-950 truncate">
                                Mission Creek Drainage Corridor
                              </h4>
                              <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-rose-200 text-rose-900 shrink-0">
                                SCORE 94
                              </span>
                            </div>
                            <p className="text-[11px] text-rose-800 mt-0.5 leading-snug font-medium">
                              24 recurring dumps. Critical plastic runoff risk to marine buffer.
                            </p>
                          </div>
                        </div>

                        {/* Moderate Cluster */}
                        <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-start gap-3 shadow-xs">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <MapPin className="w-5 h-5 text-amber-100" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-xs font-extrabold text-amber-950 truncate">
                                Civic Center Plaza Pedestrian Zone
                              </h4>
                              <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 shrink-0">
                                SCORE 89
                              </span>
                            </div>
                            <p className="text-[11px] text-amber-800 mt-0.5 leading-snug font-medium">
                              19 incidents recorded. Overflowing pedestrian bins along corridor.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTelemetryTab === 'detection' && (
                      <div className="space-y-3 animate-fadeIn text-xs">
                        <div className="p-3.5 rounded-2xl bg-sage-100/80 border border-sage-300 space-y-2">
                          <div className="flex items-center justify-between font-mono text-[11px]">
                            <span className="font-bold text-darkgreen-950 flex items-center gap-1.5">
                              <Cpu className="w-3.5 h-3.5 text-botanical-600" />
                              YOLOv8 Inference Pipeline (Staged)
                            </span>
                            <span className="text-darkgreen-800 font-bold">98.4% Conf</span>
                          </div>
                          <div className="space-y-1.5 text-[11px] text-charcoal-700">
                            <div className="flex justify-between font-medium">
                              <span>PET Beverage Plastics:</span>
                              <span className="font-bold font-mono text-darkgreen-900">14 Items (82%)</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span>Aluminum Scrap / Cans:</span>
                              <span className="font-bold font-mono text-darkgreen-900">6 Items (18%)</span>
                            </div>
                            <div className="w-full h-1.5 bg-sage-200 rounded-full overflow-hidden">
                              <div className="h-full bg-darkgreen-700 rounded-full w-[82%]" />
                            </div>
                          </div>
                        </div>
                        <p className="text-[11px] text-sage-700 leading-snug font-medium">
                          Autonomous material classification triggers in Phase 2 upon photo upload.
                        </p>
                      </div>
                    )}

                    {activeTelemetryTab === 'dispatch' && (
                      <div className="space-y-3 animate-fadeIn text-xs">
                        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                          <div className="flex items-center justify-between font-mono text-[11px]">
                            <span className="font-bold text-blue-950 flex items-center gap-1.5">
                              <Activity className="w-3.5 h-3.5 text-blue-600" />
                              Squad Alpha Active Deployment
                            </span>
                            <span className="text-blue-700 font-bold">In Transit</span>
                          </div>
                          <p className="text-[11px] text-blue-800 font-medium">
                            Destination: Buena Vista Park Lawn • ETA: 18 mins • Work Order #CLN-803
                          </p>
                        </div>
                        <p className="text-[11px] text-sage-700 leading-snug font-medium">
                          Automated work orders dispatched with verified GPS navigation coordinates.
                        </p>
                      </div>
                    )}

                    {/* Bottom Response Metrics Strip */}
                    <div className="p-3.5 rounded-2xl bg-sage-100/90 border border-sage-300 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-sage-600 font-bold block">
                          District Response Efficiency
                        </span>
                        <p className="text-lg font-black text-darkgreen-950 font-mono">
                          94.2% within 24h
                        </p>
                      </div>
                      <Link to="/hotspots">
                        <Button variant="primary" size="xs" icon={ArrowRight} iconPosition="right" className="bg-darkgreen-800 text-beige-50">
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

      {/* Environmental Impact Statistics Section (Warm Beige Cards + Sage Badges) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="sage" dot pulse dotColor="bg-botanical-600" className="mb-2.5">
            Verified Municipal Impact Telemetry
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-darkgreen-950 tracking-tight">
            Real-Time Community Outcomes
          </h2>
          <p className="text-sm text-charcoal-600 mt-2 leading-relaxed font-medium">
            Every submission directly updates municipal sanitation priority scores, ensuring crews are deployed where ecological risk is highest.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card hover className="p-6 text-center group border-beige-300/90 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-sage-100 text-darkgreen-800 flex items-center justify-center mx-auto mb-3.5 border border-sage-300 shadow-xs transition-transform duration-300 group-hover:scale-110">
              <Layers className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-darkgreen-950 tracking-tight font-mono">
              {formatNumber(metrics?.totalReportsLogged || 469)}
            </div>
            <p className="text-xs font-bold text-darkgreen-900 mt-1">Pollution Incidents Logged</p>
            <p className="text-[11px] text-sage-600 font-bold mt-0.5 font-mono">+14% MoM Civic Volume</p>
          </Card>

          <Card hover className="p-6 text-center group border-beige-300/90 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-botanical-100 text-botanical-900 flex items-center justify-center mx-auto mb-3.5 border border-botanical-300 shadow-xs transition-transform duration-300 group-hover:scale-110">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-darkgreen-950 tracking-tight font-mono">
              {formatNumber(metrics?.completedCleanups || 391)}
            </div>
            <p className="text-xs font-bold text-darkgreen-900 mt-1">Certified Cleanups</p>
            <p className="text-[11px] text-botanical-700 font-bold mt-0.5 font-mono">83.3% Full Resolution</p>
          </Card>

          <Card hover className="p-6 text-center group border-beige-300/90 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-beige-200 text-darkgreen-900 flex items-center justify-center mx-auto mb-3.5 border border-beige-300 shadow-xs transition-transform duration-300 group-hover:scale-110">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-darkgreen-950 tracking-tight font-mono">
              {formatNumber(metrics?.totalWasteCollectedKg || 4280)} <span className="text-lg font-bold">kg</span>
            </div>
            <p className="text-xs font-bold text-darkgreen-900 mt-1">Litter Diverted from Waters</p>
            <p className="text-[11px] text-sage-600 font-bold mt-0.5 font-mono">~2.4 Tons CO₂ Offset</p>
          </Card>

          <Card hover className="p-6 text-center group border-beige-300/90 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-3.5 border border-amber-300 shadow-xs transition-transform duration-300 group-hover:scale-110">
              <Flame className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-darkgreen-950 tracking-tight font-mono">
              {metrics?.activeHotspotsTracked || 6}
            </div>
            <p className="text-xs font-bold text-darkgreen-900 mt-1">Active Clusters Mapped</p>
            <p className="text-[11px] text-amber-700 font-bold mt-0.5 font-mono">Targeted for Remediation</p>
          </Card>
        </div>
      </section>

      {/* 4-Step Operational Workflow (Beige Canvas + Dark Green & Sage) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] rounded-3xl border border-beige-300/90 p-8 sm:p-12 lg:p-16 shadow-soft relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-14 relative z-10">
            <Badge variant="sage" className="mb-2.5">
              Structured Operations
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-darkgreen-950 tracking-tight">
              The Civic-to-Municipal Pipeline
            </h2>
            <p className="text-sm text-charcoal-600 mt-2 font-medium">
              From civic capture to certified photographic completion in four systematic steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="relative group space-y-3.5 p-5 rounded-2xl bg-beige-50 border border-beige-300 hover:border-darkgreen-600 transition-all duration-300 hover:shadow-soft-md">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-darkgreen-900 to-darkgreen-800 text-limeaccent-300 flex items-center justify-center font-black text-lg shadow-soft-sm group-hover:scale-105 transition-transform">
                01
              </div>
              <h3 className="font-bold text-base text-darkgreen-950">Capture & Geotag</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
                Citizens submit photographic evidence. Accurate coordinates are tagged using Leaflet interactive pins or mobile GPS.
              </p>
              <div className="pt-2 text-[11px] font-mono font-bold text-sage-600">
                EXIF GPS Sync
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group space-y-3.5 p-5 rounded-2xl bg-beige-50 border border-beige-300 hover:border-darkgreen-600 transition-all duration-300 hover:shadow-soft-md">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-darkgreen-900 to-darkgreen-800 text-limeaccent-300 flex items-center justify-center font-black text-lg shadow-soft-sm group-hover:scale-105 transition-transform">
                02
              </div>
              <h3 className="font-bold text-base text-darkgreen-950">Hotspot Clustering</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
                Geospatial algorithms aggregate reports to detect repeat dump zones and calculate multi-factor priority scores.
              </p>
              <div className="pt-2 text-[11px] font-mono font-bold text-sage-600">
                DBSCAN Density Engine
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group space-y-3.5 p-5 rounded-2xl bg-beige-50 border border-beige-300 hover:border-darkgreen-600 transition-all duration-300 hover:shadow-soft-md">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-darkgreen-900 to-darkgreen-800 text-limeaccent-300 flex items-center justify-center font-black text-lg shadow-soft-sm group-hover:scale-105 transition-transform">
                03
              </div>
              <h3 className="font-bold text-base text-darkgreen-950">Municipal Dispatch</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
                Sanitation authorities allocate prioritized work orders to specialized cleanup crews with volume estimates.
              </p>
              <div className="pt-2 text-[11px] font-mono font-bold text-sage-600">
                Contractor Work Orders
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative group space-y-3.5 p-5 rounded-2xl bg-beige-50 border border-beige-300 hover:border-darkgreen-600 transition-all duration-300 hover:shadow-soft-md">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-darkgreen-900 to-darkgreen-800 text-limeaccent-300 flex items-center justify-center font-black text-lg shadow-soft-sm group-hover:scale-105 transition-transform">
                04
              </div>
              <h3 className="font-bold text-base text-darkgreen-950">Photographic Audit</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed font-medium">
                Field teams upload post-remediation photographs for side-by-side verification and civic transparency.
              </p>
              <div className="pt-2 text-[11px] font-mono font-bold text-sage-600">
                Before/After Verified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Traditional vs EcoWatch AI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <Badge variant="sage">Intelligent Paradigm Shift</Badge>
            <h2 className="text-3xl font-extrabold text-darkgreen-950 tracking-tight leading-snug">
              Why Cities Choose EcoWatch AI Over Manual Audits
            </h2>
            <p className="text-sm text-charcoal-600 leading-relaxed font-medium">
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
              <div className="p-6 rounded-2xl bg-white border border-rose-200/90 shadow-soft space-y-3">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                  ✕
                </div>
                <h4 className="font-bold text-base text-rose-950">Traditional City Operations</h4>
                <ul className="space-y-2 text-xs text-charcoal-600 font-medium">
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
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border-2 border-darkgreen-700 shadow-soft-md space-y-3 relative overflow-hidden">
                <span className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sage-200 text-darkgreen-900 border border-sage-300">
                  RECOMMENDED
                </span>
                <div className="w-8 h-8 rounded-lg bg-darkgreen-800 text-beige-100 flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <h4 className="font-bold text-base text-darkgreen-950">EcoWatch AI Platform</h4>
                <ul className="space-y-2 text-xs text-charcoal-700 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-darkgreen-800 font-bold">✓</span>
                    <span>Automated hotspot density clustering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-darkgreen-800 font-bold">✓</span>
                    <span>Under 24-hour dispatch resolution rate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-darkgreen-800 font-bold">✓</span>
                    <span>Side-by-side photographic certification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-darkgreen-800 font-bold">✓</span>
                    <span>Multi-factor priority score algorithm</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner (Dark Green + Warm Beige Accent) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 text-beige-100 text-center overflow-hidden bg-gradient-to-br from-darkgreen-950 via-darkgreen-900 to-darkgreen-950 border border-darkgreen-800 shadow-soft-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-darkgreen-800/80 border border-darkgreen-700 text-sage-200 font-mono text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-limeaccent-400" /> Start Safeguarding Your Community
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Protect Your Local Environment with Precision AI?
            </h2>

            <p className="text-beige-200 text-sm leading-relaxed font-medium">
              Join active civic reporters, municipal sanitation managers, and environmental teams mapping public pollution and accelerating cleanups.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/report">
                <Button variant="primary" size="lg" icon={Camera} glow className="shadow-lg bg-beige-100 hover:bg-white text-darkgreen-950 border-white font-extrabold">
                  Submit a Litter Report Now
                </Button>
              </Link>
              <Link to="/map">
                <Button
                  variant="outline"
                  size="lg"
                  icon={Compass}
                  className="border-darkgreen-700 text-beige-100 bg-darkgreen-800/80 hover:bg-darkgreen-800 hover:text-white"
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
