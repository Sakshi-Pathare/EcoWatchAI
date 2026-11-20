import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Compass,
  LogIn,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', hashId: 'hero' },
    { name: 'About', hashId: 'about' },
    { name: 'Our Mission', hashId: 'solution' },
    { name: 'Capabilities', hashId: 'capabilities' },
    { name: 'How It Works', hashId: 'how-it-works' },
    { name: 'Pollution Map', hashId: 'gis-intelligence' },
    { name: 'Hotspot Intel', hashId: 'hotspot-intel' },
    { name: 'Technology', hashId: 'technology' },
    { name: 'Impact', hashId: 'impact' },
  ];

  const handleNavClick = (hashId, e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${hashId}`);
    } else {
      const element = document.getElementById(hashId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 font-sans">
      {/* Top Sovereign Indian Smart-City Strip (Deepest Spruce #051412 & Luminous Pista Text) */}
      <div className="bg-[#051412] text-white text-[11px] py-1.5 px-4 border-b border-[#1B4A45]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#74D7CB] font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#74D7CB] animate-ping" />
              National Environmental Cartography Grid
            </span>
            <span className="hidden md:inline text-[#428078]">•</span>
            <span className="hidden md:inline text-[#E0F2EE] font-medium font-sans">
              Smart Environmental Intelligence Initiative | Maharashtra Metro Grid
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span className="hidden sm:inline text-[#C4EAE2]">OPEN PUBLIC PORTAL</span>
            <span className="text-[#74D7CB] font-black tracking-wide">v2.4 GIS READY</span>
          </div>
        </div>
      </div>

      {/* Main Landing Navigation Bar (Nocturnal Spruce #092421 + Luminous Pista #74D7CB Bottom Stripe) */}
      <div
        className={clsx(
          'transition-all duration-300 border-b-2 border-[#74D7CB]',
          isScrolled
            ? 'bg-[#092421]/95 backdrop-blur-md shadow-[0_4px_24px_rgba(116,215,203,0.22)]'
            : 'bg-[#092421] shadow-[0_4px_24px_rgba(116,215,203,0.18)]'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Brand Logo with Editorial Serif & Vasundhara AI Emblem */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-2xl bg-[#123632] flex items-center justify-center p-0.5 shadow-soft transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(116,215,203,0.4)] border border-[#27403C] overflow-hidden">
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

            {/* Desktop Navigation Links (Pill Dock) */}
            <nav className="hidden xl:flex items-center p-1.5 bg-[#102D27] rounded-full border border-[#23584E] shadow-inner space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={`#${link.hashId}`}
                  onClick={(e) => handleNavClick(link.hashId, e)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 text-white hover:text-[#74D7CB] hover:bg-white/5 font-sans cursor-pointer"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Right Side Actions: Sign In & Launch Platform */}
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={LogIn}
                  className="text-[#74D7CB] hover:text-white hover:bg-white/10 rounded-full font-bold px-3.5 py-1.5 text-xs font-mono"
                >
                  {user ? 'My Account' : 'Sign In'}
                </Button>
              </Link>

              <Link to="/app">
                <Button
                  variant="primary"
                  size="sm"
                  icon={Compass}
                  className="bg-gradient-to-r from-[#74D7CB] to-[#51C4B5] hover:from-[#88DFD4] hover:to-[#63CEC0] text-[#092421] font-black rounded-full px-5 py-2 shadow-[0_0_20px_rgba(116,215,203,0.35)] hover:shadow-[0_0_25px_rgba(116,215,203,0.55)] border border-[#74D7CB] hover:scale-105 active:scale-95 transition-all text-xs tracking-wider uppercase font-mono"
                >
                  Launch Platform
                </Button>
              </Link>
            </div>

            {/* Mobile hamburger button */}
            <div className="flex xl:hidden items-center gap-2">
              <Link to="/app">
                <Button variant="primary" size="xs" className="bg-gradient-to-r from-[#74D7CB] to-[#51C4B5] text-[#092421] font-black">
                  Launch App
                </Button>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-white hover:bg-white/10 focus:outline-none transition-colors border border-[#27403C]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-[#74D7CB]" /> : <Menu className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-[#27403C] bg-[#092421]/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-fadeIn font-sans">
            <div className="p-3 rounded-2xl bg-[#123632] border border-[#27403C] flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#74D7CB] animate-pulse" />
                <span className="text-xs font-bold text-white">Public Portal Navigation</span>
              </div>
              <Link
                to="/app"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1 rounded-lg bg-[#74D7CB] text-[#092421] text-xs font-black shadow-xs font-mono"
              >
                Launch App →
              </Link>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`#${link.hashId}`}
                onClick={(e) => handleNavClick(link.hashId, e)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-white hover:text-[#74D7CB] hover:bg-white/5 transition-colors"
              >
                {link.name}
              </a>
            ))}

            <div className="pt-3 border-t border-[#27403C] flex items-center gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#102D27] text-white hover:text-[#74D7CB] text-xs font-bold text-center border border-[#23584E]"
              >
                Sign In
              </Link>
              <Link
                to="/app"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#74D7CB] to-[#51C4B5] text-[#092421] text-xs font-black text-center font-mono"
              >
                Launch Platform →
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
