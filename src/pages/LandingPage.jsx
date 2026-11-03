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
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card, CardBody } from '../components/common/Card';
import { analyticsService } from '../services/analyticsService';
import { formatNumber } from '../utils/formatters';

export function LandingPage() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    analyticsService.getDashboardMetrics().then(setMetrics);
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-forest-50/60 via-offwhite-100 to-offwhite-100 border-b border-sage-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100/80 border border-forest-200 text-forest-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-limeaccent-600" />
                <span>Next-Gen Civic Environmental Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest-900 tracking-tight leading-[1.12]">
                Eliminate Urban Litter with{' '}
                <span className="text-forest-600 underline decoration-limeaccent-400 decoration-wavy decoration-2">
                  Predictive Geospatial Intelligence
                </span>
              </h1>

              <p className="text-lg text-charcoal-600 leading-relaxed max-w-2xl">
                EcoWatch AI empowers civic reporters and municipal authorities to map public pollution, identify chronic accumulation hotspots, and dispatch verified cleanup operations with data-driven precision.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link to="/report">
                  <Button variant="primary" size="lg" icon={Camera} className="w-full sm:w-auto shadow-md">
                    Report Litter
                  </Button>
                </Link>
                <Link to="/map">
                  <Button variant="outline" size="lg" icon={Compass} className="w-full sm:w-auto">
                    Explore Pollution Map
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-sage-200 flex flex-wrap items-center gap-6 text-xs text-charcoal-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-600" />
                  <span>100% Software Architecture</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-600" />
                  <span>OpenStreetMap GIS Engine</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-600" />
                  <span>FastAPI & YOLO Ready</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Graphic / Interactive Teaser */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -top-6 -left-6 w-72 h-72 bg-limeaccent-200/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-forest-200/40 rounded-full blur-3xl pointer-events-none" />

                <div className="relative bg-white rounded-2xl border border-sage-200/90 shadow-soft-lg overflow-hidden">
                  <div className="px-5 py-3.5 bg-forest-900 text-white flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-limeaccent-400 animate-pulse" />
                      <span className="font-semibold tracking-wide">Live Hotspot Alert Feed</span>
                    </div>
                    <span className="text-[11px] text-sage-300">San Francisco Bay Area</span>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/70 border border-rose-200/80">
                      <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                        <Flame className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-rose-900">Mission Creek Drainage Corridor</h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-200 text-rose-800">
                            Score 94
                          </span>
                        </div>
                        <p className="text-[11px] text-rose-700 mt-0.5">
                          24 recurring litter incidents recorded. High plastic runoff risk.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
                      <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-amber-900">Civic Center Plaza</h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-800">
                            Score 89
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-700 mt-0.5">
                          19 recurring incidents. Overflowing pedestrian bins.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-forest-50/60 border border-forest-200 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-charcoal-500">Dispatch Response Rate</span>
                        <p className="text-lg font-bold text-forest-900">94.2% within 24h</p>
                      </div>
                      <Link to="/hotspots">
                        <Button variant="secondary" size="sm" icon={ArrowRight}>
                          Intel View
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

      {/* Environmental Impact Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-forest-700 uppercase tracking-widest">
            Measurable Environmental Outcomes
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900 mt-1">
            Real-Time Community Impact
          </h2>
          <p className="text-sm text-charcoal-600 mt-2">
            Aggregated performance metrics logged across active civic reporting sectors.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-2xl border border-sage-200 text-center shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center mx-auto mb-3 border border-forest-200">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
              {formatNumber(metrics?.totalReportsLogged || 469)}
            </div>
            <p className="text-xs font-semibold text-charcoal-700 mt-1">Pollution Reports Logged</p>
            <p className="text-[11px] text-charcoal-500 mt-0.5">+14% month-over-month</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sage-200 text-center shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-limeaccent-100 text-limeaccent-800 flex items-center justify-center mx-auto mb-3 border border-limeaccent-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
              {formatNumber(metrics?.completedCleanups || 391)}
            </div>
            <p className="text-xs font-semibold text-charcoal-700 mt-1">Verified Cleanups</p>
            <p className="text-[11px] text-forest-700 font-medium mt-0.5">83.3% resolution rate</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sage-200 text-center shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3 border border-emerald-200">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
              {formatNumber(metrics?.totalWasteCollectedKg || 4280)} <span className="text-lg">kg</span>
            </div>
            <p className="text-xs font-semibold text-charcoal-700 mt-1">Litter Removed</p>
            <p className="text-[11px] text-charcoal-500 mt-0.5">Diverted from waterways</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sage-200 text-center shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3 border border-amber-200">
              <Flame className="w-5 h-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
              {metrics?.activeHotspotsTracked || 6}
            </div>
            <p className="text-xs font-semibold text-charcoal-700 mt-1">Active Hotspots Monitored</p>
            <p className="text-[11px] text-charcoal-500 mt-0.5">Targeted for infrastructure</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-sage-200/90 p-8 sm:p-12 shadow-soft">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-forest-700 uppercase tracking-widest">
              Operational Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900 mt-1">
              How EcoWatch AI Works
            </h2>
            <p className="text-sm text-charcoal-600 mt-2">
              From civic capture to municipal verification, our platform streamlines the complete cleanup lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="space-y-3 relative">
              <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-200 text-forest-800 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-base text-charcoal-900">Capture & Geotag</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Citizens upload photographic evidence. Precise coordinates are tagged via interactive map or device GPS.
              </p>
            </div>

            <div className="space-y-3 relative">
              <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-200 text-forest-800 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-base text-charcoal-900">Hotspot Clustering</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Spatial algorithms aggregate isolated reports to detect recurring dump sites and calculate priority impact scores.
              </p>
            </div>

            <div className="space-y-3 relative">
              <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-200 text-forest-800 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-base text-charcoal-900">Municipal Dispatch</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Authorities and sanitation contractors receive structured task queues with priority rankings and waste estimates.
              </p>
            </div>

            <div className="space-y-3 relative">
              <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-200 text-forest-800 flex items-center justify-center font-bold text-lg">
                4
              </div>
              <h3 className="font-bold text-base text-charcoal-900">Photographic Audit</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Crews record post-cleanup verification imagery, closing the civic feedback loop with transparent public reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Platform Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-forest-700 uppercase tracking-widest">
            Core Technology
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900 mt-1">
            Built for Environmental Integrity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center border border-forest-200">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-charcoal-900">GIS Geospatial Clustering</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Powered by OpenStreetMap and Leaflet for fluid, high-resolution rendering without restrictive proprietary map licensing fees.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-limeaccent-100 text-limeaccent-800 flex items-center justify-center border border-limeaccent-300">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-charcoal-900">Hotspot Intelligence Engine</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Ranks public zones based on recurrence frequency, material severity, and ecological proximity to waterways or school corridors.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center border border-forest-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-charcoal-900">Verification & Audit Trails</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Side-by-side before and after resolution tracking provides municipal supervisors with incontrovertible proof of contractor completion.
            </p>
          </Card>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-soft-lg">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-limeaccent-400/20 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Protect Your Local Environment?
          </h2>
          <p className="text-sage-200 text-sm max-w-xl mx-auto mt-2 mb-6 leading-relaxed">
            Join thousands of active civic volunteers and municipal officers recording pollution hotspots and restoring public spaces.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/report">
              <Button variant="lime" size="lg" icon={Camera}>
                Submit a Litter Report
              </Button>
            </Link>
            <Link to="/map">
              <Button variant="outline" size="lg" className="border-forest-600 text-white bg-forest-800/80 hover:bg-forest-700">
                View Interactive Map
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

