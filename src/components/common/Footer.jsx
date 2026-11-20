import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Shield, Globe, Award, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#092421] text-[#E2F7F2] border-t-2 border-[#74D7CB] mt-20 shadow-[0_-4px_24px_rgba(116,215,203,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#123632] border border-[#27403C] p-1 flex items-center justify-center text-[#74D7CB] shadow-xs overflow-hidden shrink-0">
                <img
                  src="/images/vasundhara-ai-logo.png"
                  alt="Vasundhara AI environmental sustainability logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-xl text-white">Vasundhara</span>
                <span className="text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded-full bg-[#1B4A45] text-[#74D7CB] border border-[#74D7CB]/50 uppercase">
                  AI
                </span>
              </div>
            </div>
            <p className="text-xs text-[#E2F7F2] leading-relaxed font-normal">
              Empowering municipal councils, environmental stewards, and civic volunteers with actionable geospatial pollution intelligence.
            </p>
            <p className="text-[11px] text-[#74D7CB] font-medium tracking-wide">
              Smart Environmental Monitoring for a Cleaner Tomorrow
            </p>
            <div className="flex items-center gap-2 text-xs font-medium">
              <Shield className="w-4 h-4 text-[#74D7CB]" />
              <span className="text-white">Municipal Grade Security & Integrity</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-black text-[#74D7CB] uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/map" className="text-white hover:text-[#74D7CB] transition-colors block">
                  Interactive GIS Pollution Map
                </Link>
              </li>
              <li>
                <Link to="/hotspots" className="text-white hover:text-[#74D7CB] transition-colors block">
                  Hotspot Intelligence Engine
                </Link>
              </li>
              <li>
                <Link to="/cleanups" className="text-white hover:text-[#74D7CB] transition-colors block">
                  Municipal Dispatch & Cleanups
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-white hover:text-[#74D7CB] transition-colors block">
                  Litter Reporting Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Operational Portals */}
          <div>
            <h4 className="text-xs font-black text-[#74D7CB] uppercase tracking-wider mb-3">
              Stakeholder Portals
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/dashboard" className="text-white hover:text-[#74D7CB] transition-colors block">
                  Citizen Volunteer Portal
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-white hover:text-[#74D7CB] transition-colors block">
                  Municipal Command Dashboard
                </Link>
              </li>
              <li>
                <Link to="/my-reports" className="text-white hover:text-[#74D7CB] transition-colors block">
                  Submission History & Verification
                </Link>
              </li>
              <li>
                <span className="text-[#A3D9CE]/70 cursor-not-allowed">FastAPI Integration (Phase 2)</span>
              </li>
            </ul>
          </div>

          {/* Architecture & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#74D7CB] uppercase tracking-wider mb-2">
              System Architecture
            </h4>
            <div className="p-4 rounded-2xl bg-[#102D27] border border-[#23584E] text-xs shadow-soft">
              <p className="font-extrabold text-white text-sm mb-1">Pure Software Intelligence</p>
              <p className="text-xs text-[#E2F7F2] leading-relaxed font-normal">
                Zero physical hardware dependencies. Powered by OpenStreetMap GIS, modular REST services, and upcoming YOLOv8 computer vision classification.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#1B4A45] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A9DED3] font-medium">
          <p className="text-white">© 2026 Vasundhara AI. Designed for sustainable civic intelligence.</p>
          <div className="flex items-center gap-6">
            <span className="text-white">OpenStreetMap GIS</span>
            <span className="text-white">FastAPI-Ready Client</span>
            <span className="text-[#74D7CB] font-mono font-bold tracking-wide">STATUS: OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
