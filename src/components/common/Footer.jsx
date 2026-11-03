import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Shield, Globe, Award, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-forest-900 text-offwhite-200 border-t border-forest-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-forest-700 flex items-center justify-center text-limeaccent-300">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">EcoWatch AI</span>
            </div>
            <p className="text-xs text-sage-300 leading-relaxed">
              Empowering municipal councils, environmental stewards, and civic volunteers with actionable geospatial pollution intelligence.
            </p>
            <div className="flex items-center gap-2 text-xs text-sage-400">
              <Shield className="w-4 h-4 text-limeaccent-400" />
              <span>Municipal Grade Security & Integrity</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-semibold text-limeaccent-300 uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/map" className="hover:text-white transition-colors">
                  Interactive GIS Pollution Map
                </Link>
              </li>
              <li>
                <Link to="/hotspots" className="hover:text-white transition-colors">
                  Hotspot Intelligence Engine
                </Link>
              </li>
              <li>
                <Link to="/cleanups" className="hover:text-white transition-colors">
                  Municipal Dispatch & Cleanups
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-white transition-colors">
                  Litter Reporting Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Operational Portals */}
          <div>
            <h4 className="text-xs font-semibold text-limeaccent-300 uppercase tracking-wider mb-3">
              Stakeholder Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Citizen Volunteer Portal
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Municipal Command Dashboard
                </Link>
              </li>
              <li>
                <Link to="/my-reports" className="hover:text-white transition-colors">
                  Submission History & Verification
                </Link>
              </li>
              <li>
                <span className="text-sage-400 cursor-not-allowed">FastAPI Integration (Phase 2)</span>
              </li>
            </ul>
          </div>

          {/* Architecture & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-limeaccent-300 uppercase tracking-wider mb-2">
              System Architecture
            </h4>
            <div className="p-3 rounded-lg bg-forest-800/80 border border-forest-700 text-xs text-sage-200">
              <p className="font-semibold text-white mb-1">Pure Software Intelligence</p>
              <p className="text-[11px] text-sage-300 leading-normal">
                Zero physical hardware dependencies. Powered by OpenStreetMap GIS, modular REST services, and upcoming YOLOv8 computer vision classification.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-forest-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sage-400">
          <p>© 2026 EcoWatch AI. Designed for sustainable civic intelligence.</p>
          <div className="flex items-center gap-6">
            <span>OpenStreetMap GIS</span>
            <span>FastAPI-Ready Client</span>
            <span>Phase 1 Frontend</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

