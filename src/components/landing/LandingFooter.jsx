import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-[#FAF8F3] text-[#17251E] border-t border-[#E4D2BF] relative overflow-hidden font-sans">
      {/* Subtle Indian Tricolor Hairline Accent */}
      <div className="h-1 bg-gradient-to-r from-[#E99A43] via-white to-[#183D2B] opacity-75" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-14">
          {/* Brand & Overview */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-[#E4D2BF] p-1 flex items-center justify-center text-[#183D2B] shadow-xs overflow-hidden shrink-0">
                <img
                  src="/images/vasundhara-ai-logo.png"
                  alt="Vasundhara AI environmental sustainability logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-2xl text-[#102F24]">Vasundhara</span>
                <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FAF5EF] text-[#183D2B] border border-[#E4D2BF] uppercase">
                  AI
                </span>
              </div>
            </div>

            <p className="text-xs text-[#183D2B] font-mono font-bold uppercase tracking-widest">
              Smart Environmental Monitoring
            </p>

            <p className="text-xs text-[#17251E]/80 leading-relaxed font-normal">
              Empowering citizens, municipal authorities, and environmental engineers with
              geospatial pollution intelligence and verified cleanup resolution audits.
            </p>

            <div className="pt-2">
              <Link
                to="/app"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#FAF5EF] text-[#102F24] border border-[#E4D2BF] text-xs font-mono font-bold transition-all shadow-xs"
              >
                Enter Operational App <ExternalLink className="w-3.5 h-3.5 text-[#183D2B]" />
              </Link>
            </div>
          </div>

          {/* Platform Capabilities Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#183D2B] uppercase tracking-wider">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/report" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  1. Citizen Incident Reporting
                </Link>
              </li>
              <li>
                <a href="#technology" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  2. AI-Assisted Image Analysis
                </a>
              </li>
              <li>
                <Link to="/map" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  3. Pollution GIS Mapping
                </Link>
              </li>
              <li>
                <Link to="/hotspots" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  4. Hotspot Intelligence
                </Link>
              </li>
              <li>
                <Link to="/cleanups" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  5. Municipal Cleanup Operations
                </Link>
              </li>
              <li>
                <Link to="/cleanups" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  6. Before-and-After Auditing
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  7. Analytics & Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Page Sections */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#183D2B] uppercase tracking-wider">
              Public Sections
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="#hero" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  Home & Overview
                </a>
              </li>
              <li>
                <a href="#about-intro" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  The Problem & Mission
                </a>
              </li>
              <li>
                <a href="#capabilities" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  Core Capabilities
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  Operational Workflow
                </a>
              </li>
              <li>
                <a href="#gis-intel" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  Geospatial Cartography
                </a>
              </li>
              <li>
                <a href="#technology" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  Technology Stack
                </a>
              </li>
              <li>
                <a href="#impact" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  Public Impact Metrics
                </a>
              </li>
            </ul>
          </div>

          {/* Sovereign System Specs */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#183D2B] uppercase tracking-wider">
              Technology Architecture
            </h4>
            <div className="p-4 rounded-2xl bg-white border border-[#E4D2BF] text-xs font-mono space-y-1.5 shadow-soft-xs">
              <div className="text-[11px] text-[#183D2B] flex items-center justify-between pb-1 border-b border-[#E4D2BF]">
                <span className="font-bold">SYSTEM ARCHITECTURE</span>
                <span className="text-[#E99A43] font-bold">ACTIVE</span>
              </div>
              <div className="text-[#17251E]/80 space-y-1 text-[11px] pt-1">
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
        <div className="mt-12 pt-8 border-t border-[#E4D2BF] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#17251E]/75">
          <p className="text-center md:text-left text-[11px] max-w-3xl leading-relaxed">
            <b className="text-[#102F24]">Notice & Disclaimer:</b> Vasundhara AI is an independent civic environmental monitoring platform engineered to demonstrate sovereign smart-city geospatial intelligence and citizen engagement. It does not represent a statutory municipal or governmental authority unless formally designated by respective municipal corporations.
          </p>

          <div className="text-right font-mono text-[11px] shrink-0 text-[#183D2B] font-bold">
            © 2026 Vasundhara AI • Maharashtra Environmental Grid
          </div>
        </div>
      </div>
    </footer>
  );
}
