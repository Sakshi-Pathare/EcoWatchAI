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
      {/* Top Telemetry Ticker Strip (Deepest Spruce #051412 & High-Contrast Pista Text) */}
      <div className="bg-[#051412] text-white text-[11px] py-1.5 px-4 border-b border-[#1B4A45]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#74D7CB] font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#74D7CB] animate-ping" />
              Live GIS Telemetry
            </span>
            <span className="hidden md:inline text-[#428078]">•</span>
            <span className="hidden md:inline text-[#E0F2EE] font-medium">
              San Francisco Municipal Grid • 469 Incidents Monitored
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span className="hidden sm:inline text-[#C4EAE2]">DENSITY RADAR: NORMAL</span>
            <span className="text-[#74D7CB] font-black tracking-wide">94.2% RESOLUTION RATE</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Nocturnal Spruce #092421 + Luminous Pista #74D7CB Bottom Stripe) */}
      <div className="bg-[#092421] border-b-2 border-[#74D7CB] shadow-[0_4px_24px_rgba(116,215,203,0.18)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo with Editorial Serif & Vasundhara AI Emblem */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-2xl bg-[#123632] flex items-center justify-center p-0.5 text-white shadow-soft transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(116,215,203,0.4)] border border-[#27403C] overflow-hidden">
                <img
                  src="/images/vasundhara-ai-logo.png"
                  alt="Vasundhara AI environmental sustainability logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-2xl tracking-normal text-white">
                    Vasundhara
                  </span>
                  <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full bg-[#1B4A45] text-[#74D7CB] border border-[#74D7CB]/50 uppercase shadow-xs">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-[#A3D9CE] font-bold tracking-widest uppercase -mt-0.5 hidden sm:block">
                  Smart Environmental Monitoring
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links (Prakrushti High-Contrast Rounded-Full Pill Dock) */}
            <nav className="hidden lg:flex items-center p-1.5 bg-[#102D27] rounded-full border border-[#23584E] shadow-inner space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={clsx(
                      'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 relative',
                      active
                        ? 'bg-gradient-to-r from-[#1E5247] to-[#16433A] text-[#74D7CB] shadow-sm border border-[#74D7CB]/60'
                        : 'text-white hover:text-[#74D7CB] hover:bg-white/10'
                    )}
                  >
                    <Icon className={clsx('w-3.5 h-3.5', active ? 'text-[#74D7CB]' : 'text-[#A3D9CE]')} />
                    <span className={clsx(active ? 'text-[#74D7CB] font-black' : 'text-white font-semibold')}>{link.name}</span>
                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#74D7CB] shadow-[0_0_6px_#74D7CB] absolute bottom-0.5 left-1/2 -translate-x-1/2" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons & User Profile */}
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/report">
                <Button
                  variant="pista"
                  size="sm"
                  icon={Camera}
                  glow
                  className="rounded-full px-4 py-2 font-black shadow-lg shadow-[#74D7CB]/25 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  Report Litter
                </Button>
              </Link>

              <Link
                to="/dashboard"
                className="group relative flex items-center gap-2.5 pl-2 pr-3.5 py-1 rounded-full bg-[#102D27] hover:bg-[#1B4A45] border border-[#23584E] hover:border-[#74D7CB]/60 transition-all duration-200 shadow-soft-xs"
                title="Active Reporter Profile"
              >
                <div className="w-7 h-7 rounded-full bg-[#74D7CB] text-[#092421] flex items-center justify-center font-black text-xs shadow-xs border border-[#98E0D5]">
                  AM
                </div>
                <div className="text-left hidden xl:block">
                  <div className="text-[11px] font-black text-white leading-none">Alex M.</div>
                  <div className="text-[9px] font-bold text-[#A3D9CE]">Level 2 Eco</div>
                </div>
              </Link>
            </div>

            {/* Mobile hamburger button */}
            <div className="flex lg:hidden items-center gap-2">
              <Link to="/report">
                <Button variant="pista" size="xs" icon={Camera}>
                  Report
                </Button>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-white hover:text-[#74D7CB] hover:bg-[#1B4A45] focus:outline-none transition-colors border border-[#27403C]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#27403C] bg-[#092421]/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-1.5 animate-fadeIn">
            <div className="p-2.5 rounded-xl bg-[#123632] border border-[#27403C] flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <img
                  src="/images/vasundhara-ai-logo.png"
                  alt="Vasundhara AI environmental sustainability logo"
                  className="w-5 h-5 object-contain"
                />
                <span className="text-xs font-bold text-white">Vasundhara GIS Active</span>
              </div>
              <span className="text-[10px] font-mono text-[#74D7CB] font-bold">SF BAY REGION</span>
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
                    'px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between transition-colors',
                    active
                      ? 'bg-[#1D4A42] text-[#74D7CB] border border-[#74D7CB]/50 shadow-xs'
                      : 'text-white hover:text-[#74D7CB] hover:bg-[#123632]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={clsx('w-4 h-4', active ? 'text-[#74D7CB]' : 'text-[#A3D9CE]')} />
                    <span className={active ? 'text-[#74D7CB]' : 'text-white'}>{link.name}</span>
                  </div>
                  {active && <span className="text-xs font-mono text-[#74D7CB] font-black">ACTIVE</span>}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
