import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#092421] text-[#E2F7F2] border-t-2 border-[#74D7CB] mt-20 shadow-[0_-4px_24px_rgba(116,215,203,0.12)] relative overflow-hidden font-sans">
      {/* Sovereign Indian Tricolor Accent Ribbon */}
      <div className="h-1 bg-gradient-to-r from-[#E99A43] via-white to-[#74D7CB] opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
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
                <span className="text-[10px] font-mono font-black tracking-wider px-2 py-0.5 rounded-full bg-[#1B4A45] text-[#74D7CB] border border-[#74D7CB]/50 uppercase">
                  AI
                </span>
              </div>
            </div>

            <p className="text-xs text-[#74D7CB] font-mono font-bold uppercase tracking-widest">
              Smart Environmental Monitoring
            </p>

            <p className="text-xs text-[#E2F7F2]/85 leading-relaxed font-normal">
              Empowering municipal corporations, environmental engineers, and civic volunteers with
              actionable geospatial pollution intelligence and verified cleanup resolution audits.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-[#74D7CB]">
              <Shield className="w-4 h-4 text-[#74D7CB]" />
              <span className="text-white">Municipal Grade Security & Integrity</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#74D7CB] uppercase tracking-wider">
              Platform Features
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/map" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  Interactive GIS Pollution Map
                </Link>
              </li>
              <li>
                <Link to="/hotspots" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  Hotspot Intelligence Engine
                </Link>
              </li>
              <li>
                <Link to="/cleanups" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  Municipal Dispatch & Cleanups
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  Litter Reporting Wizard
                </Link>
              </li>
            </ul>
          </div>

          {/* Operational Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#74D7CB] uppercase tracking-wider">
              Stakeholder Portals
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/dashboard" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  Citizen Volunteer Portal
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  Municipal Command Dashboard
                </Link>
              </li>
              <li>
                <Link to="/my-reports" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  Submission History & Verification
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white/85 hover:text-[#74D7CB] transition-colors block">
                  Sign In / Access Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#74D7CB] uppercase tracking-wider mb-2">
              System Architecture
            </h4>
            <div className="p-4 rounded-2xl bg-[#102D27] border border-[#23584E] text-xs shadow-soft space-y-1.5">
              <p className="font-extrabold text-white text-sm">Pure Software Architecture</p>
              <p className="text-xs text-[#E2F7F2]/85 leading-relaxed font-normal">
                Zero physical hardware dependencies. Powered by OpenStreetMap GIS, modular REST services, and upcoming YOLOv8 computer vision classification.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Status */}
        <div className="mt-12 pt-8 border-t border-[#1B4A45] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#A9DED3] font-medium">
          <p className="text-white text-center md:text-left">
            © 2026 Vasundhara AI. Designed for sustainable civic intelligence across Maharashtra.
          </p>
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
