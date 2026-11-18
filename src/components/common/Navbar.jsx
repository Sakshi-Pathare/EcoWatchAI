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
    <header className="sticky top-0 z-50 transition-all">
      {/* Top Telemetry Ticker Strip */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white text-[11px] py-1 px-4 border-b border-forest-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-limeaccent-300 font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-limeaccent-400 animate-ping" />
              Live GIS Radar
            </span>
            <span className="hidden md:inline text-forest-400">•</span>
            <span className="hidden md:inline text-sage-200">
              San Francisco Municipal Grid • 469 Incidents Monitored
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-sage-300 font-mono">
            <span className="hidden sm:inline">PRECISION CLUSTER ENGINE: ONLINE</span>
            <span className="text-limeaccent-400 font-bold">94.2% RESOLUTION RATE</span>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-sage-200/80 shadow-[0_4px_20px_-4px_rgba(24,71,48,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo with Glow */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-forest-800 via-forest-700 to-forest-900 flex items-center justify-center text-white shadow-soft transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow-lime">
                <Leaf className="w-5 h-5 text-limeaccent-300 transition-transform duration-300 group-hover:rotate-12" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-limeaccent-400 border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-forest-950 font-sans">
                    EcoWatch
                  </span>
                  <span className="text-[10px] font-black tracking-wider px-1.5 py-0.5 rounded-md bg-gradient-to-r from-limeaccent-100 to-limeaccent-200 text-limeaccent-900 border border-limeaccent-400/80 uppercase shadow-xs">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-charcoal-400 font-semibold tracking-wider uppercase -mt-1 hidden sm:block">
                  Civic Pollution Intelligence
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center p-1 bg-sage-100/60 rounded-2xl border border-sage-200/80 backdrop-blur-sm">
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
                        ? 'bg-white text-forest-950 shadow-soft-sm font-bold border border-sage-200/60'
                        : 'text-charcoal-600 hover:text-forest-900 hover:bg-white/50'
                    )}
                  >
                    <Icon className={clsx('w-3.5 h-3.5', active ? 'text-forest-700' : 'text-charcoal-400')} />
                    <span>{link.name}</span>
                    {active && (
                      <span className="w-1 h-1 rounded-full bg-limeaccent-600 absolute bottom-0.5 left-1/2 -translate-x-1/2" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons & User Profile */}
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/report">
                <Button
                  variant="lime"
                  size="sm"
                  icon={Camera}
                  glow
                  className="shadow-soft hover:shadow-glow-lime text-forest-950"
                >
                  Report Litter
                </Button>
              </Link>

              <Link
                to="/dashboard"
                className="group relative flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full bg-offwhite-200/80 hover:bg-white border border-sage-200/90 transition-all duration-200 shadow-soft-xs hover:shadow-soft"
                title="Active Reporter Profile"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-forest-700 to-forest-500 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-white">
                  AM
                </div>
                <div className="text-left hidden xl:block">
                  <div className="text-[11px] font-bold text-charcoal-900 leading-none">Alex M.</div>
                  <div className="text-[9px] font-semibold text-forest-700">Level 2 Eco</div>
                </div>
              </Link>
            </div>

            {/* Mobile hamburger button */}
            <div className="flex lg:hidden items-center gap-2">
              <Link to="/report">
                <Button variant="lime" size="xs" icon={Camera}>
                  Report
                </Button>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-charcoal-700 hover:text-charcoal-900 hover:bg-sage-100/80 focus:outline-none transition-colors border border-sage-200"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-sage-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-1.5 animate-fadeIn">
            <div className="p-2 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-limeaccent-600 animate-ping" />
                <span className="text-xs font-semibold text-forest-900">GIS Telemetry Active</span>
              </div>
              <span className="text-[10px] font-mono text-forest-700 font-bold">SF BAY REGION</span>
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
                      ? 'bg-forest-50 text-forest-900 font-bold border border-forest-200/70'
                      : 'text-charcoal-600 hover:text-forest-900 hover:bg-offwhite-200'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={clsx('w-4 h-4', active ? 'text-forest-700' : 'text-charcoal-400')} />
                    <span>{link.name}</span>
                  </div>
                  {active && <span className="text-xs font-mono text-limeaccent-700 font-bold">ACTIVE</span>}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
