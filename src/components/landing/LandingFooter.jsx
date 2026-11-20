import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-[#092421] text-[#E2F7F2] border-t-2 border-[#74D7CB] relative overflow-hidden font-sans shadow-[0_-4px_24px_rgba(116,215,203,0.12)]">
      {/* Subtle Indian Tricolor Hairline Accent */}
      <div className="h-1 bg-gradient-to-r from-[#E99A43] via-white to-[#74D7CB] opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-14">
          {/* Brand & Overview */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#123632] border border-[#27403C] p-1 flex items-center justify-center text-[#74D7CB] shadow-xs overflow-hidden shrink-0">
                <img
                  src="/images/vasundhara-ai-logo.png"
                  alt="Vasundhara AI environmental sustainability logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-2xl text-white">Vasundhara</span>
                <span className="text-[10px] font-mono font-black tracking-wider px-2 py-0.5 rounded-full bg-[#1B4A45] text-[#74D7CB] border border-[#74D7CB]/50 uppercase shadow-xs">
                  AI
                </span>
              </div>
            </div>

            <p className="text-xs text-[#74D7CB] font-mono font-bold uppercase tracking-widest">
              Smart Environmental Monitoring
            </p>

            <p className="text-xs text-[#E2F7F2]/85 leading-relaxed font-normal">
              Empowering citizens, municipal authorities, and environmental engineers with
              geospatial pollution intelligence and verified cleanup resolution audits.
            </p>

            <div className="pt-2">
              <Link
                to="/app"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#102D27] hover:bg-[#163D35] text-[#74D7CB] border border-[#23584E] text-xs font-mono font-bold transition-all shadow-xs"
              >
                Enter Operational App <ExternalLink className="w-3.5 h-3.5 text-[#74D7CB]" />
              </Link>
            </div>
          </div>

          {/* Platform Capabilities Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#74D7CB] uppercase tracking-wider">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/report" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  1. Citizen Incident Reporting
                </Link>
              </li>
              <li>
                <a href="#technology" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  2. AI-Assisted Image Analysis
                </a>
              </li>
              <li>
                <Link to="/map" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  3. Pollution GIS Mapping
                </Link>
              </li>
              <li>
                <Link to="/hotspots" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  4. Hotspot Intelligence
                </Link>
              </li>
              <li>
                <Link to="/cleanups" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  5. Municipal Cleanup Operations
                </Link>
              </li>
              <li>
                <Link to="/cleanups" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  6. Before-and-After Auditing
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  7. Analytics & Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Page Sections */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#74D7CB] uppercase tracking-wider">
              Public Sections
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="#hero" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  Home & Overview
                </a>
              </li>
              <li>
                <a href="#about-intro" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  The Problem & Mission
                </a>
              </li>
              <li>
                <a href="#capabilities" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  Core Capabilities
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  Operational Workflow
                </a>
              </li>
              <li>
                <a href="#gis-intel" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  Geospatial Cartography
                </a>
              </li>
              <li>
                <a href="#technology" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  Technology Stack
                </a>
              </li>
              <li>
                <a href="#impact" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  Public Impact Metrics
                </a>
              </li>
            </ul>
          </div>

          {/* Sovereign System Specs */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#74D7CB] uppercase tracking-wider">
              Technology Architecture
            </h4>
            <div className="p-4 rounded-2xl bg-[#102D27] border border-[#23584E] text-xs font-mono space-y-1.5 shadow-soft">
              <div className="text-[11px] text-[#74D7CB] flex items-center justify-between pb-1 border-b border-[#23584E]">
                <span className="font-bold">SYSTEM ARCHITECTURE</span>
                <span className="text-[#74D7CB] font-bold">ACTIVE</span>
              </div>
              <div className="text-[#E2F7F2]/85 space-y-1 text-[11px] pt-1">
                <div>• Frontend: React 18 & Vite</div>
                <div>• Cartography: Leaflet & OpenStreetMap</div>
                <div>• Backend: FastAPI / Python Services</div>
                <div>• Analytics: Recharts Engine</div>
                <div>• Vision: YOLO-based Detection (Staged)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Civic Notice */}
        <div className="mt-12 pt-8 border-t border-[#1B4A45] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#A9DED3] font-medium">
          <p className="text-center md:text-left text-[11px] max-w-3xl leading-relaxed text-white">
            <b className="text-[#74D7CB]">Notice & Disclaimer:</b> Vasundhara AI is an independent civic environmental monitoring platform engineered to demonstrate sovereign smart-city geospatial intelligence and citizen engagement. It does not represent a statutory municipal or governmental authority unless formally designated by respective municipal corporations.
          </p>

          <div className="text-right font-mono text-[11px] shrink-0 text-[#74D7CB] font-bold">
            © 2026 Vasundhara AI • Maharashtra Environmental Grid
          </div>
        </div>
      </div>
    </footer>
  );
}
