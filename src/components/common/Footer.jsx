import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Shield, Globe, Award, Sparkles, Heart, Activity } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-forest-950 via-forest-900 to-forest-950 text-offwhite-200 border-t border-forest-800/80 mt-28 overflow-hidden">
      {/* Background ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-limeaccent-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-forest-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-forest-700 to-forest-800 flex items-center justify-center text-limeaccent-300 shadow-glow-forest border border-forest-600/60">
                <Leaf className="w-5 h-5 text-limeaccent-300" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">EcoWatch AI</span>
                <span className="block text-[10px] text-sage-300 font-mono tracking-wider uppercase">Environmental Intelligence</span>
              </div>
            </div>

            <p className="text-xs text-sage-300 leading-relaxed max-w-sm">
              Empowering civic volunteers, environmental NGOs, and municipal authorities with high-precision GIS mapping, automated litter clustering, and verified cleanup workflows.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-sage-300">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-800/80 border border-forest-700 text-limeaccent-300">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span className="font-mono text-[11px]">GIS Feed: Normal (99.9% Up)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-800/80 border border-forest-700 text-sage-200">
                <Shield className="w-3.5 h-3.5 text-limeaccent-400" />
                <span className="text-[11px]">Audited Data Pipeline</span>
              </div>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold text-limeaccent-300 uppercase tracking-widest mb-4">
              Intelligence Grid
            </h4>
            <ul className="space-y-2.5 text-xs text-sage-200">
              <li>
                <Link to="/map" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Interactive GIS Map</span>
                </Link>
              </li>
              <li>
                <Link to="/hotspots" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Hotspot Scoring Engine</span>
                </Link>
              </li>
              <li>
                <Link to="/cleanups" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Sanitation Dispatch Hub</span>
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Submit Litter Report</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-xs font-bold text-limeaccent-300 uppercase tracking-widest mb-4">
              Stakeholder Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-sage-200">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Citizen Volunteer Portal
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Municipal Command Center
                </Link>
              </li>
              <li>
                <Link to="/my-reports" className="hover:text-white transition-colors">
                  Submission Verification History
                </Link>
              </li>
              <li>
                <span className="text-sage-400 text-[11px] font-mono">FastAPI Endpoints (Phase 2)</span>
              </li>
            </ul>
          </div>

          {/* Architecture Badge */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-limeaccent-300 uppercase tracking-widest mb-3">
              Zero-Hardware Architecture
            </h4>
            <div className="p-4 rounded-2xl bg-forest-800/60 border border-forest-700/80 backdrop-blur-sm space-y-2 text-xs">
              <div className="flex items-center gap-2 text-white font-bold">
                <Sparkles className="w-4 h-4 text-limeaccent-400" />
                <span>Pure Software Model</span>
              </div>
              <p className="text-[11px] text-sage-300 leading-relaxed">
                No physical sensors needed. Powered by crowdsourced photographic audits, OpenStreetMap coordinates, and upcoming YOLOv8 inference.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="mt-14 pt-8 border-t border-forest-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sage-400 font-mono">
          <p>© 2026 EcoWatch AI. Environmental Intelligence & Civic Sanitation.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span className="text-sage-300">OpenStreetMap Data</span>
            <span className="text-sage-300">FastAPI Ready</span>
            <span className="text-limeaccent-400 font-bold">Phase 1 Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
