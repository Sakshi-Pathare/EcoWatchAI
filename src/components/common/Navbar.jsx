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
} from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from './Button';

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sage-200/90 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center text-white shadow-soft transition-transform group-hover:scale-105">
              <Leaf className="w-5 h-5 text-limeaccent-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-forest-900 tracking-tight">EcoWatch</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-limeaccent-100 text-limeaccent-800 border border-limeaccent-300">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-charcoal-400 font-medium tracking-wide uppercase -mt-1 hidden sm:block">
                Pollution Intelligence
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={clsx(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5',
                    active
                      ? 'bg-forest-50 text-forest-800 font-semibold'
                      : 'text-charcoal-600 hover:text-forest-800 hover:bg-offwhite-200'
                  )}
                >
                  <Icon className={clsx('w-4 h-4', active ? 'text-forest-700' : 'text-charcoal-400')} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Button & User profile */}
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/report">
              <Button variant="primary" size="sm" icon={Camera} className="shadow-sm">
                Report Litter
              </Button>
            </Link>

            <Link
              to="/dashboard"
              className="p-2 rounded-lg text-charcoal-600 hover:text-forest-800 hover:bg-offwhite-200 transition-colors"
              title="Civic User Profile"
            >
              <div className="w-8 h-8 rounded-full bg-sage-200 text-forest-800 flex items-center justify-center font-medium text-xs border border-sage-300">
                AM
              </div>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link to="/report">
              <Button variant="primary" size="sm" icon={Camera}>
                Report
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-charcoal-600 hover:text-charcoal-900 hover:bg-sage-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-sage-200 bg-white px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  'px-3 py-2.5 rounded-lg text-base font-medium flex items-center gap-3',
                  active
                    ? 'bg-forest-50 text-forest-800 font-semibold'
                    : 'text-charcoal-600 hover:text-forest-800 hover:bg-offwhite-200'
                )}
              >
                <Icon className={clsx('w-5 h-5', active ? 'text-forest-700' : 'text-charcoal-400')} />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

