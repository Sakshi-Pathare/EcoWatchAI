import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
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
  LogOut,
  ChevronDown,
  LogIn,
  Compass,
  ArrowLeft,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from './Button';
import { useAuth } from '../../contexts/AuthContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'App Hub', path: '/app', icon: Compass },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Pollution Map', path: '/map', icon: MapPin },
    { name: 'Hotspot Intel', path: '/hotspots', icon: Flame },
    { name: 'Cleanups', path: '/cleanups', icon: CheckSquare },
    { name: 'My Reports', path: '/my-reports', icon: Layers },
    { name: 'Admin', path: '/admin', icon: ShieldCheck },
  ];

  const isActive = (path) => {
    if (path === '/app' && location.pathname === '/app') return true;
    if (path !== '/app' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 transition-all font-sans">
      {/* Top Telemetry Ticker Strip in Skin Beige */}
      <div className="bg-[#FAF5EF] text-[#17251E] text-[11px] py-1.5 px-4 border-b border-[#E4D2BF]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#183D2B] font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#E99A43] animate-ping" />
              Live GIS Telemetry
            </span>
            <span className="hidden md:inline text-[#183D2B]/30">•</span>
            <span className="hidden md:inline text-[#17251E]/80 font-medium font-sans">
              {user?.municipalityName ? `${user.municipalityName} Grid` : 'Maharashtra Municipal Operations • Pune & Mumbai Grid'} • 469 Incidents Monitored
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span className="hidden sm:inline text-[#17251E]/70">DENSITY RADAR: NORMAL</span>
            <span className="text-[#183D2B] font-bold tracking-wide">94.2% RESOLUTION RATE</span>
          </div>
        </div>
      </div>

      {/* Main Operational Application Navigation Bar in Skin Beige */}
      <div className="bg-[#FAF8F3] border-b border-[#E4D2BF] shadow-soft-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Return to Public Site Pill */}
            <div className="flex items-center gap-3">
              <Link to="/app" className="flex items-center gap-3 group">
                <div className="relative w-9 h-9 rounded-2xl bg-white flex items-center justify-center p-0.5 shadow-soft transition-all duration-300 group-hover:scale-105 border border-[#183D2B]/20 overflow-hidden">
                  <img
                    src="/images/vasundhara-ai-logo.png"
                    alt="Vasundhara AI environmental sustainability logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-xl text-[#102F24]">Vasundhara</span>
                    <span className="text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#183D2B]/10 text-[#183D2B] border border-[#183D2B]/20 uppercase">
                      APP
                    </span>
                  </div>
                </div>
              </Link>

              {/* Direct Return to Public Website */}
              <Link
                to="/"
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#FAF5EF] text-[#102F24] border border-[#E4D2BF] text-[11px] font-mono font-bold transition-all shadow-xs ml-2"
                title="Return to the public storytelling landing page"
              >
                <ArrowLeft className="w-3 h-3 text-[#183D2B]" /> Public Website
              </Link>
            </div>

            {/* Desktop Operational Navigation Links */}
            <nav className="hidden lg:flex items-center p-1.5 bg-[#FAF5EF] rounded-full border border-[#E4D2BF] shadow-inner space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={clsx(
                      'px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 relative font-sans',
                      active
                        ? 'bg-white text-[#102F24] shadow-xs border border-[#183D2B]/20 font-bold'
                        : 'text-[#17251E]/75 hover:text-[#102F24] hover:bg-white/60'
                    )}
                  >
                    <Icon className={clsx('w-3.5 h-3.5', active ? 'text-[#183D2B]' : 'text-[#17251E]/60')} />
                    <span>{link.name}</span>
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
                  className="bg-[#102F24] hover:bg-[#183D2B] text-white rounded-full px-4 py-2 font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-xs tracking-wider uppercase font-mono"
                >
                  Report Litter
                </Button>
              </Link>

              {user ? (
                /* Authenticated User Profile Pill & Dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="group relative flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full bg-white hover:bg-[#FAF5EF] border border-[#E4D2BF] transition-all duration-200 shadow-soft-xs text-left cursor-pointer"
                    title="View Account Profile & Session"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#183D2B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {getInitials(user.name)}
                    </div>
                    <div className="text-left hidden xl:block">
                      <div className="text-[11px] font-bold text-[#102F24] leading-none truncate max-w-[110px]">
                        {user.name}
                      </div>
                      <div className="text-[9px] font-medium text-[#183D2B] truncate max-w-[110px]">
                        {user.badge || (user.role === 'citizen' ? 'Citizen Steward' : 'Municipal Officer')}
                      </div>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#183D2B] transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#E4D2BF] shadow-soft-lg py-2 text-xs text-[#17251E] z-50 animate-fadeIn font-sans">
                      <div className="px-4 py-3 border-b border-[#E4D2BF] space-y-1">
                        <div className="font-bold text-sm text-[#102F24]">{user.name}</div>
                        <div className="text-[11px] text-[#17251E]/70 truncate font-mono">{user.email}</div>
                        <div className="pt-1 flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#FAF5EF] text-[#183D2B] border border-[#E4D2BF]">
                            {user.roleLabel || user.role}
                          </span>
                          {user.karmaScore && (
                            <span className="text-[10px] font-bold text-[#102F24]">
                              ⚡ {user.karmaScore} Karma
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to={user.role === 'citizen' ? '/dashboard' : '/admin'}
                          onClick={() => setUserDropdownOpen(false)}
                          className="px-4 py-2 hover:bg-[#FAF5EF] flex items-center gap-2.5 text-[#17251E] hover:text-[#102F24] font-semibold transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-[#183D2B]" />
                          {user.role === 'citizen' ? 'My Steward Dashboard' : 'Municipal Command Center'}
                        </Link>
                        <Link
                          to="/my-reports"
                          onClick={() => setUserDropdownOpen(false)}
                          className="px-4 py-2 hover:bg-[#FAF5EF] flex items-center gap-2.5 text-[#17251E] hover:text-[#102F24] font-semibold transition-colors"
                        >
                          <Layers className="w-3.5 h-3.5 text-[#183D2B]" />
                          My Incident Reports
                        </Link>
                        <Link
                          to="/"
                          onClick={() => setUserDropdownOpen(false)}
                          className="px-4 py-2 hover:bg-[#FAF5EF] flex items-center gap-2.5 text-[#17251E] hover:text-[#102F24] font-semibold transition-colors"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 text-[#183D2B]" />
                          Visit Public Website
                        </Link>
                        <Link
                          to="/login"
                          onClick={() => setUserDropdownOpen(false)}
                          className="px-4 py-2 hover:bg-[#FAF5EF] flex items-center gap-2.5 text-[#17251E] hover:text-[#102F24] font-semibold transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-[#183D2B]" />
                          Switch Account / Role
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-[#E4D2BF]">
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-700 hover:text-rose-800 font-bold flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-600" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Unauthenticated Sign In Button */
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={LogIn}
                    className="text-[#102F24] hover:text-[#183D2B] hover:bg-[#FAF5EF] rounded-full font-bold px-3.5 py-1.5 text-xs font-mono"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile hamburger button */}
            <div className="flex lg:hidden items-center gap-2">
              <Link to="/report">
                <Button variant="primary" size="xs" icon={Camera} className="bg-[#102F24] text-white">
                  Report
                </Button>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#102F24] hover:bg-[#FAF5EF] focus:outline-none transition-colors border border-[#E4D2BF]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E4D2BF] bg-[#FAF8F3] px-4 pt-3 pb-6 space-y-2 animate-fadeIn font-sans">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E4D2BF]">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-mono text-[#183D2B] flex items-center gap-1.5 font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Website
              </Link>
              <span className="text-[10px] font-mono text-[#17251E]/60">APP MODE</span>
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
                      ? 'bg-white text-[#102F24] border border-[#183D2B]/20 shadow-xs'
                      : 'text-[#17251E] hover:text-[#102F24] hover:bg-[#FAF5EF]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#183D2B]" />
                    <span>{link.name}</span>
                  </div>
                  {active && <span className="text-xs font-mono text-[#183D2B] font-bold">ACTIVE</span>}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-[#E4D2BF]">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 rounded-xl bg-white text-[#102F24] hover:bg-[#FAF5EF] text-xs font-bold flex items-center justify-center gap-2 border border-[#E4D2BF]"
              >
                <User className="w-3.5 h-3.5 text-[#183D2B]" />
                {user ? 'Manage Account / Switch Role' : 'Sign In / Register Portal'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
