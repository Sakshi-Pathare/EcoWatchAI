import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#183D2B] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 p-1 flex items-center justify-center text-white overflow-hidden">
                <img
                  src="/images/vasundhara-ai-logo.png"
                  alt="Vasundhara AI environmental sustainability logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-serif font-bold text-xl text-white">Vasundhara AI</span>
            </div>
            <p className="text-xs text-[#E2F7F2] leading-relaxed font-normal">
              Empowering municipal councils, environmental stewards, and civic volunteers with actionable geospatial pollution intelligence.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium">
              <Shield className="w-4 h-4 text-white/80" />
              <span className="text-white">Persistent API-backed reporting</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/map" className="text-white/85 hover:text-white transition-colors block">
                  Interactive GIS Pollution Map
                </Link>
              </li>
              <li>
                <Link to="/hotspots" className="text-white/85 hover:text-white transition-colors block">
                  Hotspot Intelligence Engine
                </Link>
              </li>
              <li>
                <Link to="/cleanups" className="text-white/85 hover:text-white transition-colors block">
                  Municipal Dispatch & Cleanups
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-white/85 hover:text-white transition-colors block">
                  Litter Reporting Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Operational Portals */}
          <div>
            <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-3">
              Stakeholder Portals
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/dashboard" className="text-white/85 hover:text-white transition-colors block">
                  Citizen Volunteer Portal
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-white/85 hover:text-white transition-colors block">
                  Municipal Command Dashboard
                </Link>
              </li>
              <li>
                <Link to="/my-reports" className="text-white/85 hover:text-white transition-colors block">
                  Submission History & Verification
                </Link>
              </li>
              <li>
                <span className="text-white">FastAPI REST API & cleanup tracking</span>
              </li>
            </ul>
          </div>

          {/* Architecture & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-2">
              System Architecture
            </h4>
            <div className="p-4 rounded-xl bg-white/10 border border-white/15 text-xs">
              <p className="font-extrabold text-white text-sm mb-1">Pure Software Intelligence</p>
              <p className="text-xs text-[#E2F7F2] leading-relaxed font-normal">
                No physical hardware dependencies. Uses OpenStreetMap GIS, a FastAPI backend, persistent SQLite or PostgreSQL storage, and an optional locally configured YOLO detector.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/75 font-medium">
          <p className="text-white">© 2026 Vasundhara AI. Designed for sustainable civic intelligence.</p>
          <div className="flex items-center gap-6">
            <span className="text-white">OpenStreetMap GIS</span>
            <span className="text-white">FastAPI + SQLite</span>
            <span className="text-white/85 font-mono font-bold tracking-wide">REPORT-BASED DATA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
