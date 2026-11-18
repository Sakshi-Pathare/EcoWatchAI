import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Leaf,
  MapPin,
  Camera,
  Layers,
  CheckSquare,
  ShieldCheck,
  User,
  Menu,
  X,
  Flame,
  LayoutDashboard,
  Radio,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from './Button';
import { Badge } from './Badge';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Pollution Map', path: '/map', icon: MapPin },
    { name: 'Hotspot Intel', path: '/hotspots', icon: Flame },
    { name: 'My Reports', path: '/my-reports', icon: Layers },
    { name: 'Cleanups', path: '/cleanups', icon: CheckSquare },
    { name: 'Admin', path: '/admin', icon: ShieldCheck },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 transition-all font-sans">
      {/* Top Telemetry Ticker Strip (Dark Green + Warm Beige + Sage accents) */}
      <div className="bg-gradient-to-r from-darkgreen-950 via-darkgreen-900 to-darkgreen-950 text-beige-100 text-[11px] py-1.5 px-4 border-b border-darkgreen-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-limeaccent-300 font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-limeaccent-400 animate-ping" />
              Live GIS Telemetry
            </span>
            <span className="hidden md:inline text-sage-400">•</span>
            <span className="hidden md:inline text-sage-200">
              San Francisco Municipal Grid • 469 Incidents Monitored
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-sage-300 font-mono">
            <span className="hidden sm:inline text-beige-200">DENSITY RADAR: NORMAL</span>
            <span className="text-limeaccent-400 font-bold">94.2% RESOLUTION RATE</span>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Navigation Bar (Beige Canvas + Sage & Dark Green) */}
      <div className="bg-beige-50/90 backdrop-blur-xl border-b border-beige-300/80 shadow-[0_4px_20px_-4px_rgba(24,61,43,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo with Dark Green & Sage glow */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-darkgreen-900 via-darkgreen-800 to-darkgreen-950 flex items-center justify-center text-white shadow-soft transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow-forest border border-sage-600/40">
                <Leaf className="w-5 h-5 text-limeaccent-300 transition-transform duration-300 group-hover:rotate-12" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-limeaccent-400 border-2 border-beige-50" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-darkgreen-950 font-sans">
                    EcoWatch
                  </span>
                  <span className="text-[10px] font-black tracking-wider px-1.5 py-0.5 rounded-md bg-sage-200 text-darkgreen-900 border border-sage-300 uppercase shadow-xs">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-sage-600 font-semibold tracking-wider uppercase -mt-1 hidden sm:block">
                  Environmental Intelligence
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center p-1 bg-beige-200/70 rounded-2xl border border-beige-300/80 backdrop-blur-sm">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={clsx(
                      'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 relative',
                      active
                        ? 'bg-white text-darkgreen-950 shadow-soft-sm font-extrabold border border-sage-200/80'
                        : 'text-charcoal-600 hover:text-darkgreen-900 hover:bg-white/60'
                    )}
                  >
                    <Icon className={clsx('w-3.5 h-3.5', active ? 'text-darkgreen-800' : 'text-sage-500')} />
                    <span>{link.name}</span>
                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-botanical-600 absolute bottom-0.5 left-1/2 -translate-x-1/2" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons & User Profile */}
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/report">
                <Button
                  variant="primary"
                  size="sm"
                  icon={Camera}
                  glow
                  className="shadow-soft hover:shadow-glow-forest bg-darkgreen-800 hover:bg-darkgreen-900 text-beige-50 border border-darkgreen-700 font-bold"
                >
                  Report Litter
                </Button>
              </Link>

              <Link
                to="/dashboard"
                className="group relative flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full bg-beige-200/90 hover:bg-white border border-beige-300 transition-all duration-200 shadow-soft-xs hover:shadow-soft"
                title="Active Reporter Profile"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-darkgreen-800 to-darkgreen-600 text-beige-50 flex items-center justify-center font-bold text-xs shadow-xs border border-white">
                  AM
                </div>
                <div className="text-left hidden xl:block">
                  <div className="text-[11px] font-bold text-charcoal-900 leading-none">Alex M.</div>
                  <div className="text-[9px] font-semibold text-sage-600">Level 2 Eco</div>
                </div>
              </Link>
            </div>

            {/* Mobile hamburger button */}
            <div className="flex lg:hidden items-center gap-2">
              <Link to="/report">
                <Button variant="primary" size="xs" icon={Camera} className="bg-darkgreen-800 text-beige-50">
                  Report
                </Button>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-charcoal-700 hover:text-darkgreen-900 hover:bg-beige-200 focus:outline-none transition-colors border border-beige-300"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-beige-300 bg-beige-50/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-1.5 animate-fadeIn">
            <div className="p-2.5 rounded-xl bg-sage-100 border border-sage-200 flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-botanical-600 animate-ping" />
                <span className="text-xs font-bold text-darkgreen-900">GIS Telemetry Active</span>
              </div>
              <span className="text-[10px] font-mono text-sage-700 font-bold">SF BAY REGION</span>
            </div>

            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors',
                    active
                      ? 'bg-white text-darkgreen-950 font-bold border border-sage-300 shadow-xs'
                      : 'text-charcoal-600 hover:text-darkgreen-900 hover:bg-beige-200'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={clsx('w-4 h-4', active ? 'text-darkgreen-800' : 'text-sage-500')} />
                    <span>{link.name}</span>
                  </div>
                  {active && <span className="text-xs font-mono text-darkgreen-800 font-bold">ACTIVE</span>}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
