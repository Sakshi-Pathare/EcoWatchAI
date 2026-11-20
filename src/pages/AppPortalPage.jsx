import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  MapPin,
  Flame,
  CheckSquare,
  LayoutDashboard,
  ShieldCheck,
  ArrowRight,
  Radio,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { analyticsService } from '../services/analyticsService';
import { formatNumber } from '../utils/formatters';

export function AppPortalPage() {
  const { user, loginAsDemo } = useAuth();
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    analyticsService.getDashboardMetrics().then(setMetrics).catch(() => {});
  }, []);

  const operationalModules = [
    {
      id: 'report',
      title: 'Report Litter Incident',
      category: 'Citizen & Field Input',
      description: 'Submit crowdsourced photographic evidence with cryptographic GPS geotagging and material classification.',
      icon: Camera,
      path: '/report',
      ctaText: 'Open Incident Wizard',
      badge: 'Immediate Action',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
    {
      id: 'map',
      title: 'Interactive GIS Cartography',
      category: 'Geospatial Intelligence',
      description: 'Explore live spatial distribution of litter incidents, satellite imagery, density buffers, and regional clusters.',
      icon: MapPin,
      path: '/map',
      ctaText: 'Launch GIS Explorer',
      badge: 'Live Map Active',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    },
    {
      id: 'hotspots',
      title: 'Hotspot Intelligence Engine',
      category: 'Algorithmic Diagnostics',
      description: 'Inspect spatial recurrence algorithms, multi-factor risk scores, and chronic dumping corridors across Maharashtra.',
      icon: Flame,
      path: '/hotspots',
      ctaText: 'Open Hotspot Radar',
      badge: '6 Active Clusters',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    },
    {
      id: 'cleanups',
      title: 'Municipal Cleanup Dispatch',
      category: 'Operational Execution',
      description: 'Manage zonal sanitation squad work orders, review task status, and audit before-and-after photo verification.',
      icon: CheckSquare,
      path: '/cleanups',
      ctaText: 'Manage Cleanups',
      badge: '12 Active Tasks',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      id: 'dashboard',
      title: 'Citizen Steward Dashboard',
      category: 'Volunteer Workspace',
      description: 'Track your personal reporting impact, community karma points, badge rewards, and nearby neighborhood alerts.',
      icon: LayoutDashboard,
      path: '/dashboard',
      ctaText: 'Open My Dashboard',
      badge: 'Steward Portal',
      badgeColor: 'bg-sage-100 text-[#102F24] border-sage-300',
    },
    {
      id: 'admin',
      title: 'Municipal Command Center',
      category: 'Administrative Operations',
      description: 'Executive municipal overview: SLA compliance, contractor audits, ward benchmarking, and systemic resolutions.',
      icon: ShieldCheck,
      path: '/admin',
      ctaText: 'Open Command Console',
      badge: 'Authority Level',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#17251E] font-sans pb-24">
      {/* Top Application Command Bar in Warm Skin Beige */}
      <section className="bg-[#FAF5EF] text-[#17251E] pt-10 pb-12 border-b border-[#E4D2BF] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#E4D2BF]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E4D2BF] text-[#183D2B] font-mono text-[11px] font-bold uppercase tracking-wider mb-3 shadow-xs">
                <Radio className="w-3.5 h-3.5 text-[#183D2B] animate-pulse" />
                Operational Environmental Command Bridge
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#102F24] tracking-tight">
                Vasundhara AI Operational Platform
              </h1>

              <p className="text-sm sm:text-base text-[#17251E]/80 max-w-2xl mt-1 font-normal font-sans">
                Access crowdsourced reporting, geospatial analysis, recurrent hotspot intelligence, and verified
                municipal remediation tasks across Maharashtra municipal corporations.
              </p>
            </div>

            {/* Quick Session Identity Pill */}
            <div className="p-4 rounded-2xl bg-white border border-[#E4D2BF] text-xs font-mono shrink-0 space-y-2 shadow-soft-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#183D2B] text-[10px] uppercase font-bold">OPERATIONAL SESSION</span>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">ONLINE</span>
              </div>
              <div className="text-[#102F24] font-bold text-sm">
                {user ? user.name : 'Guest Evaluator'}
              </div>
              <div className="text-[11px] text-[#183D2B] font-medium">
                Role: {user?.roleLabel || (user?.role === 'citizen' ? 'Citizen Steward' : 'Municipal Officer')}
              </div>
            </div>
          </div>

          {/* Real-Time Operational Telemetry Strip in Clean White Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            <div className="p-4 rounded-2xl bg-white border border-[#E4D2BF] text-[#17251E] space-y-1 shadow-soft-xs">
              <span className="text-[10px] font-mono uppercase text-[#183D2B] block font-bold">Total Incidents Tracked</span>
              <div className="text-2xl font-serif font-bold text-[#102F24]">
                {formatNumber(metrics?.totalReportsLogged || 469)}
              </div>
              <span className="text-[10px] text-[#183D2B] font-mono">Pune & Mumbai Grid</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E4D2BF] text-[#17251E] space-y-1 shadow-soft-xs">
              <span className="text-[10px] font-mono uppercase text-[#183D2B] block font-bold">Active Hotspot Clusters</span>
              <div className="text-2xl font-serif font-bold text-[#102F24]">
                {metrics?.activeHotspotsTracked || 6}
              </div>
              <span className="text-[10px] text-rose-700 font-mono">DBSCAN Proximity Engine</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E4D2BF] text-[#17251E] space-y-1 shadow-soft-xs">
              <span className="text-[10px] font-mono uppercase text-[#183D2B] block font-bold">Certified Cleanups</span>
              <div className="text-2xl font-serif font-bold text-[#102F24]">
                {formatNumber(metrics?.completedCleanups || 391)}
              </div>
              <span className="text-[10px] text-emerald-700 font-mono">83.3% Resolution Verified</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E4D2BF] text-[#17251E] space-y-1 shadow-soft-xs">
              <span className="text-[10px] font-mono uppercase text-[#183D2B] block font-bold">District Efficiency Rate</span>
              <div className="text-2xl font-serif font-bold text-[#102F24]">
                94.2%
              </div>
              <span className="text-[10px] text-[#183D2B] font-mono">&lt; 24h Squad Dispatch</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Operational Modules Launchpad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-20">
        <div className="flex items-center justify-between pb-6">
          <span className="text-xs font-mono font-bold text-[#102F24] uppercase tracking-wider">
            Operational Platform Modules • Select Tool
          </span>
          <Link
            to="/"
            className="text-xs font-mono text-[#183D2B] hover:text-[#102F24] font-bold flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-[#E4D2BF] shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Storytelling Website
          </Link>
        </div>

        {/* 6 Large Functional Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {operationalModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E4D2BF] shadow-soft-sm hover:shadow-soft-md hover:border-[#183D2B]/40 card-lift transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF5EF] text-[#102F24] flex items-center justify-center border border-[#E4D2BF] group-hover:scale-105 transition-all shadow-xs">
                      <Icon className="w-6 h-6 text-[#183D2B]" />
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${mod.badgeColor}`}
                    >
                      {mod.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono font-bold text-[#183D2B] uppercase tracking-wider block mb-1">
                      {mod.category}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#102F24]">
                      {mod.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#17251E]/80 leading-relaxed font-sans">
                    {mod.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E4D2BF]">
                  <Link to={mod.path} className="block">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full bg-[#102F24] hover:bg-[#183D2B] text-white rounded-xl py-2.5 text-xs font-bold font-mono flex items-center justify-center gap-2 group-hover:shadow-md hover-sheen"
                    >
                      <span>{mod.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rapid Evaluator Persona Switcher Box */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border border-[#E4D2BF] shadow-soft-sm card-lift">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E4D2BF]">
            <div>
              <span className="text-xs font-mono font-bold text-[#183D2B] uppercase tracking-wider block">
                Evaluator Role Switcher
              </span>
              <h4 className="font-serif font-bold text-lg text-[#102F24]">
                Explore Vasundhara AI from Different Stakeholder Perspectives
              </h4>
            </div>
            <span className="text-xs font-mono text-[#17251E]/70 font-medium">
              Instant 1-Click Session Setup
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
            <button
              onClick={() => loginAsDemo('citizen')}
              className="p-4 rounded-2xl bg-[#FAF5EF] hover:bg-[#FAF8F3] border border-[#E4D2BF] hover:border-[#183D2B]/50 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#102F24]">Citizen Volunteer</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  120 Karma
                </span>
              </div>
              <p className="text-xs text-[#17251E]/75 leading-relaxed font-sans">
                Experience crowdsourced incident reporting, karma rewards, and public resolution tracking.
              </p>
            </button>

            <button
              onClick={() => loginAsDemo('officer')}
              className="p-4 rounded-2xl bg-[#FAF5EF] hover:bg-[#FAF8F3] border border-[#E4D2BF] hover:border-[#183D2B]/50 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#102F24]">Municipal Officer</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Ward 12 Lead
                </span>
              </div>
              <p className="text-xs text-[#17251E]/75 leading-relaxed font-sans">
                Manage squad work orders, review geocoded alerts, and certify before/after cleanups.
              </p>
            </button>

            <button
              onClick={() => loginAsDemo('superadmin')}
              className="p-4 rounded-2xl bg-[#FAF5EF] hover:bg-[#FAF8F3] border border-[#E4D2BF] hover:border-[#183D2B]/50 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#102F24]">Super Administrator</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  Director GIS
                </span>
              </div>
              <p className="text-xs text-[#17251E]/75 leading-relaxed font-sans">
                Full governance control: municipal SLA analytics, user roles, and system health telemetry.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
