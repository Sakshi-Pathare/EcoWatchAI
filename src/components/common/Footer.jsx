import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#FAF8F3] text-[#17251E] border-t border-[#E4D2BF] relative overflow-hidden font-sans">
      <div className="h-1 bg-gradient-to-r from-[#E99A43] via-white to-[#183D2B] opacity-75" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
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
              Empowering municipal corporations, environmental engineers, and civic volunteers with
              geospatial pollution intelligence and verified cleanup resolution audits.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-[#183D2B]">
              <Shield className="w-4 h-4 text-[#183D2B]" />
              <span>Sovereign Smart-City Architecture</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#183D2B] uppercase tracking-wider">
              Platform Features
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/report" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  Report Incident
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  Pollution Map (GIS)
                </Link>
              </li>
              <li>
                <Link to="/hotspots" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  Hotspot Intelligence
                </Link>
              </li>
              <li>
                <Link to="/cleanups" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  Cleanup Operations
                </Link>
              </li>
            </ul>
          </div>

          {/* Stakeholder Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#183D2B] uppercase tracking-wider">
              Operational Portals
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/dashboard" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  Citizen Volunteer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  Municipal Command Center
                </Link>
              </li>
              <li>
                <Link to="/my-reports" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  My Incident Submissions
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-[#17251E]/80 hover:text-[#102F24] transition-colors block">
                  Sign In / Access Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Infrastructure */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#183D2B] uppercase tracking-wider">
              Technology Stack
            </h4>
            <div className="p-4 rounded-2xl bg-white border border-[#E4D2BF] text-xs font-mono space-y-1.5 shadow-soft-xs">
              <div className="text-[11px] text-[#183D2B] flex items-center justify-between pb-1 border-b border-[#E4D2BF]">
                <span className="font-bold">STACK PROTOCOL</span>
                <span className="text-[#E99A43] font-bold">OPERATIONAL</span>
              </div>
              <div className="text-[#17251E]/80 space-y-1 text-[11px] pt-1">
                <div>• GIS: Leaflet & OpenStreetMap</div>
                <div>• Backend: FastAPI / Python Services</div>
                <div>• Vision: YOLOv8 Material Pipeline (Staged)</div>
                <div>• Audit: Exif Geolocation Sealing</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-[#E4D2BF] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#17251E]/75">
          <p className="text-center md:text-left text-[11px] max-w-3xl leading-relaxed">
            <b className="text-[#102F24]">Notice & Disclaimer:</b> Vasundhara AI is an independent civic environmental monitoring platform engineered to demonstrate sovereign smart-city geospatial intelligence and citizen engagement. It does not represent a statutory municipal or governmental authority unless formally designated by respective municipal corporations.
          </p>

          <div className="text-right font-mono text-[11px] shrink-0 text-[#183D2B] font-bold">
            © 2026 Vasundhara AI • Maharashtra Operations
          </div>
        </div>
      </div>
    </footer>
  );
}
