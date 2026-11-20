import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Camera,
  Layers,
  ArrowRight,
  Flame,
  CheckCircle2,
  TrendingDown,
  BarChart3,
  Sparkles,
  Compass,
  Activity,
  Award,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { analyticsService } from '../services/analyticsService';
import { hotspotService } from '../services/hotspotService';
import { request } from '../services/apiClient';
import { formatNumber } from '../utils/formatters';

export function LandingPage() {
  const [metrics, setMetrics] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [aiStatus, setAiStatus] = useState(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    Promise.all([
      analyticsService.getPublicDashboardMetrics(),
      hotspotService.getPublicHotspots('priority'),
      request('/ai/status'),
    ])
      .then(([dashboardMetrics, currentHotspots, detector]) => {
        setMetrics(dashboardMetrics);
        setHotspots(currentHotspots);
        setAiStatus(detector);
      })
      .catch((error) => setLoadError(error.message || 'Unable to load the project overview.'));
  }, []);

  return (
    <div className="space-y-20 sm:space-y-24 pb-20 font-sans">
      {loadError && <div role="alert" className="mx-auto max-w-7xl px-4 pt-4 text-sm text-rose-900">{loadError}</div>}
      <section className="relative py-12 sm:py-16 bg-[#F5F7F4] border-b border-sage-200">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
              <div className="inline-flex items-center gap-2.5 p-1.5 pr-4 rounded-full bg-white border border-sage-200 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-beige-50 border border-sage-200 p-0.5 flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src="/images/vasundhara-ai-logo.png"
                    alt="Vasundhara AI environmental sustainability logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs font-bold text-forest-900 tracking-tight">
                  Vasundhara AI • Smart Environmental Monitoring
                </span>
              </div>

              <h1 className="max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#183D2B] tracking-tight leading-[1.1]">
                Turn Public Litter into{' '}
                <span className="text-[#2F6B4F]">
                  Actionable Hotspot
                </span>{' '}
                Intelligence.
              </h1>

              {/* Subtext */}
              <p className="text-base sm:text-lg text-charcoal-700 leading-relaxed max-w-2xl font-medium">
                Vasundhara AI equips municipal sanitation crews and civic volunteers with crowdsourced photographic reports, automated recurrence clustering, and verified before-and-after resolution audits.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link to="/report">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={Camera}
                    className="w-full sm:w-auto"
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
                  <span className="font-bold text-darkgreen-950">FastAPI & Optional YOLO</span>
                </div>
              </div>
            </div>

            {/* Right Column: Data-backed project overview */}
            <div className="lg:col-span-5">
              <Card className="relative overflow-hidden border-sage-200 shadow-soft-md">
                <div className="px-5 py-4 bg-forest-800 text-white border-b border-forest-900">
                  <p className="text-[10px] uppercase tracking-wider text-white/75 font-semibold">Project operations snapshot</p>
                  <h2 className="text-lg font-serif font-bold mt-1">Report-based environmental overview</h2>
                </div>
                <CardBody className="p-5 space-y-5">
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-rose-800 font-bold">Top recurring hotspot</p>
                        <p className="text-sm font-bold text-rose-950 mt-1">
                          {hotspots[0]?.name || 'No recurring cluster yet'}
                        </p>
                      </div>
                      {hotspots[0] && (
                        <span className="text-xs font-mono font-bold text-rose-900">
                          {hotspots[0].priorityScore}/100
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-rose-800 mt-2">
                      {hotspots[0]
                        ? `${hotspots[0].recurrenceCount} reports in a 300 m cluster.`
                        : 'A hotspot appears when at least two reports are within 300 meters.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-sage-50 border border-sage-200">
                      <p className="text-xl font-black text-darkgreen-950">{metrics?.totalReports ?? 0}</p>
                      <p className="text-[10px] text-sage-700 font-bold">Reports</p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                      <p className="text-xl font-black text-amber-900">{metrics?.activeCleanupTasks ?? 0}</p>
                      <p className="text-[10px] text-amber-800 font-bold">Open cleanups</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <p className="text-xl font-black text-emerald-900">{metrics?.completedCleanups ?? 0}</p>
                      <p className="text-[10px] text-emerald-800 font-bold">Completed</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-charcoal-800">YOLO detector</span>
                    <span className={aiStatus?.available ? 'text-emerald-800 font-bold' : 'text-charcoal-500'}>
                      {aiStatus ? aiStatus.message : 'Checking backend...'}
                    </span>
                  </div>

                  <Link to="/map" className="inline-flex items-center gap-1 text-xs font-bold text-darkgreen-900 hover:text-darkgreen-700">
                    Explore report map <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Impact Statistics Section (Warm Beige Cards + Sage Badges) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="sage" dot dotColor="bg-forest-700" className="mb-2.5">
            Community Impact Metrics
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#10241B] tracking-tight">
            Current Project Data
          </h2>
          <p className="text-sm text-charcoal-600 mt-2 leading-relaxed font-medium">
            Metrics are calculated from submitted reports and recorded cleanup status. This project does not use real-time sensors.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card hover className="p-6 text-center group border-beige-300/90 shadow-soft">
            <div className="w-12 h-12 rounded-xl bg-sage-100 text-darkgreen-800 flex items-center justify-center mx-auto mb-3.5 border border-sage-200">
              <Layers className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#10241B] tracking-tight">
              {formatNumber(metrics?.totalReportsLogged || 0)}
            </div>
            <p className="text-xs font-bold text-[#10241B] mt-1">Pollution Incidents Logged</p>
            <p className="text-[11px] text-[#556E55] font-bold mt-0.5 font-mono">Reports in this project database</p>
          </Card>

          <Card hover className="p-6 text-center group">
            <div className="w-12 h-12 rounded-xl bg-botanical-100 text-botanical-900 flex items-center justify-center mx-auto mb-3.5 border border-botanical-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#10241B] tracking-tight">
              {formatNumber(metrics?.completedCleanups || 0)}
            </div>
            <p className="text-xs font-bold text-[#10241B] mt-1">Certified Cleanups</p>
            <p className="text-[11px] text-[#2D6A4F] font-bold mt-0.5 font-mono">Marked complete with an after photo</p>
          </Card>

          <Card hover className="p-6 text-center group">
            <div className="w-12 h-12 rounded-xl bg-[#EFE3D5] text-[#10241B] flex items-center justify-center mx-auto mb-3.5 border border-[#D3BCA6]">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#10241B] tracking-tight">
              {formatNumber(metrics?.totalWasteCollectedKg || 0)} <span className="text-lg font-bold">kg</span>
            </div>
            <p className="text-xs font-bold text-[#10241B] mt-1">Estimated Waste Collected</p>
            <p className="text-[11px] text-[#556E55] font-bold mt-0.5 font-mono">Based on submitted report estimates</p>
          </Card>

          <Card hover className="p-6 text-center group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-3.5 border border-amber-200">
              <Flame className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#10241B] tracking-tight">
              {metrics?.activeHotspotsTracked || 0}
            </div>
            <p className="text-xs font-bold text-[#10241B] mt-1">Active Clusters Mapped</p>
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
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#10241B] tracking-tight">
              The Civic-to-Municipal Pipeline
            </h2>
            <p className="text-sm text-charcoal-600 mt-2 font-medium">
              From civic capture to certified photographic completion in four systematic steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="relative group space-y-3.5 p-5 rounded-2xl bg-[#FFFDF9] border border-beige-300 hover:border-pista-400 transition-all duration-300 hover:shadow-soft-md">
              <div className="w-12 h-12 rounded-xl bg-forest-800 text-white border border-forest-800 flex items-center justify-center font-bold text-lg">
                01
              </div>
              <h3 className="font-bold text-base text-darkgreen-950">Capture & Geotag</h3>
              <p className="text-xs text-charcoal-700 leading-relaxed font-medium">
                Citizens submit photographic evidence. Accurate coordinates are tagged using Leaflet interactive pins or mobile GPS.
              </p>
              <div className="pt-2 text-[11px] font-mono font-bold text-sage-600">
                Manual Pin + Browser GPS
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group space-y-3.5 p-5 rounded-2xl bg-[#FFFDF9] border border-beige-300 hover:border-pista-400 transition-all duration-300 hover:shadow-soft-md">
              <div className="w-12 h-12 rounded-xl bg-forest-800 text-white border border-forest-800 flex items-center justify-center font-bold text-lg">
                02
              </div>
              <h3 className="font-bold text-base text-darkgreen-950">Hotspot Clustering</h3>
              <p className="text-xs text-charcoal-700 leading-relaxed font-medium">
                Geospatial algorithms aggregate reports to detect repeat dump zones and calculate multi-factor priority scores.
              </p>
              <div className="pt-2 text-[11px] font-mono font-bold text-sage-600">
                300 m Report Clustering
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group space-y-3.5 p-5 rounded-2xl bg-[#FFFDF9] border border-beige-300 hover:border-pista-400 transition-all duration-300 hover:shadow-soft-md">
              <div className="w-12 h-12 rounded-xl bg-forest-800 text-white border border-forest-800 flex items-center justify-center font-bold text-lg">
                03
              </div>
              <h3 className="font-bold text-base text-darkgreen-950">Municipal Dispatch</h3>
              <p className="text-xs text-charcoal-700 leading-relaxed font-medium">
                Sanitation authorities allocate prioritized work orders to specialized cleanup crews with volume estimates.
              </p>
              <div className="pt-2 text-[11px] font-mono font-bold text-sage-600">
                Contractor Work Orders
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative group space-y-3.5 p-5 rounded-2xl bg-[#FFFDF9] border border-beige-300 hover:border-pista-400 transition-all duration-300 hover:shadow-soft-md">
              <div className="w-12 h-12 rounded-xl bg-forest-800 text-white border border-forest-800 flex items-center justify-center font-bold text-lg">
                04
              </div>
              <h3 className="font-bold text-base text-darkgreen-950">Photographic Audit</h3>
              <p className="text-xs text-charcoal-700 leading-relaxed font-medium">
                Field teams upload post-remediation photographs for side-by-side verification and civic transparency.
              </p>
              <div className="pt-2 text-[11px] font-mono font-bold text-sage-600">
                Before/After Verified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Traditional vs Vasundhara AI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <Badge variant="sage">Intelligent Paradigm Shift</Badge>
            <h2 className="text-3xl font-serif font-bold text-[#10241B] tracking-tight leading-snug">
              Why Cities Choose Vasundhara AI Over Manual Audits
            </h2>
            <p className="text-sm text-charcoal-600 leading-relaxed font-medium">
              Traditional municipal street maintenance relies on delayed telephone hotlines and scheduled sweeps that miss chronic illegal dumping. Vasundhara AI provides autonomous spatial recurrence intelligence.
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

              {/* Vasundhara AI Approach */}
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border-2 border-darkgreen-700 shadow-soft-md space-y-3 relative overflow-hidden">
                <span className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sage-200 text-darkgreen-900 border border-sage-300">
                  RECOMMENDED
                </span>
                <div className="w-8 h-8 rounded-lg bg-darkgreen-800 text-beige-100 flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <h4 className="font-bold text-base text-darkgreen-950">Vasundhara AI Platform</h4>
                <ul className="space-y-2 text-xs text-charcoal-700 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-darkgreen-800 font-bold">✓</span>
                    <span>Automated hotspot density clustering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-darkgreen-800 font-bold">✓</span>
                    <span>Manual cleanup dispatch and status tracking</span>
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl p-8 sm:p-12 text-white text-center bg-forest-800 border border-forest-900">
          <div className="max-w-2xl mx-auto space-y-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Start Safeguarding Your Community
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              Ready to Protect Your Local Environment with Precision AI?
            </h2>

            <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-normal">
              Join active civic reporters, municipal sanitation managers, and environmental teams mapping public pollution and accelerating cleanups.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/report">
                <Button variant="pista" size="lg" icon={Camera} className="font-semibold text-sm px-7 py-3">
                  Submit a Litter Report Now
                </Button>
              </Link>
              <Link to="/map">
                <Button
                  variant="outline"
                  size="lg"
                  icon={Compass}
                  className="border-white/30 text-white bg-transparent hover:bg-white/10 rounded-lg px-7 py-3 font-semibold"
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
