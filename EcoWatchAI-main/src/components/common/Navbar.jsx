import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Leaf,
  MapPin,
  Camera,
  Layers,
  CheckSquare,
  ShieldCheck,
  Menu,
  X,
  Flame,
  LayoutDashboard,
  Building2,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from './Button';
import { useAuth } from '../../contexts/AuthContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    setLogoutError('');
    try {
      await logout();
    } catch (error) {
      setLogoutError(error.message || 'The server could not confirm sign out. This browser session was cleared.');
    }
  };

  const navLinks = user?.role === 'citizen'
    ? [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Pollution Map', path: '/map', icon: MapPin },
      { name: 'Hotspot Intel', path: '/hotspots', icon: Flame },
      { name: 'My Reports', path: '/my-reports', icon: Layers },
    ]
    : user
      ? [
        { name: 'Municipal Dashboard', path: '/admin', icon: ShieldCheck },
        { name: 'Pollution Map', path: '/map', icon: MapPin },
        { name: 'Hotspot Intel', path: '/hotspots', icon: Flame },
        { name: 'Cleanups', path: '/cleanups', icon: CheckSquare },
        ...(user.role === 'super_admin' ? [{ name: 'Platform Admin', path: '/superadmin', icon: Building2 }] : []),
      ]
      : [
        { name: 'Pollution Map', path: '/map', icon: MapPin },
        { name: 'Hotspot Intel', path: '/hotspots', icon: Flame },
      ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 font-sans">
      <div className="bg-white border-b border-sage-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center p-0.5 border border-forest-100 transition-colors group-hover:bg-forest-100 overflow-hidden">
                <img
                  src="/images/vasundhara-ai-logo.png"
                  alt="Vasundhara AI environmental sustainability logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-xl tracking-normal text-charcoal-900">Vasundhara AI</span>
                </div>
                <p className="text-[10px] text-charcoal-500 font-semibold tracking-wide uppercase -mt-0.5 hidden sm:block">
                  Smart Environmental Monitoring
                </p>
              </div>
            </Link>

            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={clsx(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      active
                        ? 'bg-forest-50 text-forest-900'
                        : 'text-charcoal-700 hover:bg-sage-50 hover:text-forest-900'
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden xl:flex items-center gap-3">
              {user?.role === 'citizen' && <Link to="/report">
                <Button
                  variant="primary"
                  size="sm"
                  icon={Camera}
                  className="rounded-lg px-4 py-2"
                >
                  Report Litter
                </Button>
              </Link>}
              {!user && (
                <Link to="/login">
                  <Button variant="primary" size="sm">Sign in</Button>
                </Link>
              )}
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="max-w-36 truncate text-sm font-medium text-charcoal-700" title={user.email}>{user.name}</span>
                  <button type="button" onClick={handleLogout} className="rounded-lg px-3 py-2 text-sm font-medium text-charcoal-600 hover:bg-sage-50 hover:text-forest-900">Sign out</button>
                </div>
              ) : (
                <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-forest-800 hover:bg-sage-50">Sign in</Link>
              )}
            </div>

            <div className="flex xl:hidden items-center gap-2">
              {user?.role === 'citizen' && <Link to="/report">
                <Button variant="primary" size="xs" icon={Camera}>
                  Report
                </Button>
              </Link>}
              {!user && <Link to="/login"><Button variant="primary" size="xs">Sign in</Button></Link>}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
                className="p-2 rounded-lg text-charcoal-700 hover:bg-sage-100 focus:outline-none focus:ring-2 focus:ring-forest-700 transition-colors border border-sage-200"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-sage-200 bg-white px-4 py-3 space-y-1">

            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors',
                    active
                      ? 'bg-forest-50 text-forest-900'
                      : 'text-charcoal-700 hover:bg-sage-50 hover:text-forest-900'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </div>
                  {active && <span className="text-xs text-forest-700 font-semibold">Current</span>}
                </Link>
              );
            })}
            <div className="border-t border-sage-200 pt-2 mt-2">
              {user ? (
                <button type="button" onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="w-full px-3 py-2.5 text-left text-sm font-medium text-charcoal-700 hover:bg-sage-50 rounded-lg">Sign out ({user.name})</button>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-forest-800 hover:bg-sage-50 rounded-lg">Sign in / Register</Link>
              )}
            </div>
          </div>
        )}
      </div>
      {logoutError && <div role="alert" className="bg-rose-50 px-4 py-2 text-center text-xs text-rose-900 border-t border-rose-200">{logoutError}</div>}
    </header>
  );
}
