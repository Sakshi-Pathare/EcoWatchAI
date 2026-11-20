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

  // Scroll listener for sticky transparent-to-solid transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
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
    { name: 'About', hashId: 'about-intro' },
    { name: 'Our Mission', hashId: 'mission' },
    { name: 'How It Works', hashId: 'how-it-works' },
    { name: 'Capabilities', hashId: 'capabilities' },
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
      {/* Top Sovereign Indian Smart-City Strip in Warm Skin Beige */}
      <div className="bg-[#FAF5EF] text-[#17251E] text-[11px] py-1.5 px-4 border-b border-[#E4D2BF]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#183D2B] font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#E99A43] animate-ping" />
              National Environmental Cartography Grid
            </span>
            <span className="hidden md:inline text-[#183D2B]/30">•</span>
            <span className="hidden md:inline text-[#17251E]/80 font-medium font-sans">
              Smart Environmental Intelligence Initiative | Maharashtra Metro Grid
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span className="hidden sm:inline text-[#17251E]/70">OPEN PUBLIC PORTAL</span>
            <span className="text-[#183D2B] font-bold tracking-wide">v2.4 GIS READY</span>
          </div>
        </div>
      </div>

      {/* Main Landing Navigation Bar in Same Warm Skin Beige */}
      <div
        className={clsx(
          'transition-all duration-300 border-b',
          isScrolled
            ? 'bg-[#FAF8F3]/95 backdrop-blur-md border-[#E4D2BF] shadow-soft'
            : 'bg-[#FAF8F3] border-[#E4D2BF]/80 shadow-soft-xs'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Brand Logo with Editorial Serif & Vasundhara AI Emblem */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-2xl bg-white flex items-center justify-center p-0.5 shadow-soft transition-all duration-300 group-hover:scale-105 border border-[#183D2B]/20 overflow-hidden">
                <img
                  src="/images/vasundhara-ai-logo.png"
                  alt="Vasundhara AI environmental sustainability logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-2xl tracking-normal text-[#102F24]">
                    Vasundhara
                  </span>
                  <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#183D2B]/10 text-[#183D2B] border border-[#183D2B]/20 uppercase shadow-xs">
                    AI
                  </span>
                </div>
                <p className="text-[9px] text-[#183D2B] font-mono font-bold tracking-widest uppercase -mt-0.5 hidden sm:block">
                  Smart Environmental Monitoring
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center p-1.5 bg-[#FAF5EF] rounded-full border border-[#E4D2BF] shadow-inner space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={`#${link.hashId}`}
                  onClick={(e) => handleNavClick(link.hashId, e)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 text-[#17251E]/80 hover:text-[#102F24] hover:bg-white font-sans cursor-pointer"
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
                  className="text-[#102F24] hover:text-[#183D2B] hover:bg-[#FAF5EF] rounded-full font-bold px-3.5 py-1.5 text-xs font-mono"
                >
                  {user ? 'My Account' : 'Sign In'}
                </Button>
              </Link>

              <Link to="/app">
                <Button
                  variant="primary"
                  size="sm"
                  icon={Compass}
                  className="bg-[#102F24] hover:bg-[#183D2B] text-white rounded-full px-5 py-2 font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-xs tracking-wider uppercase font-mono"
                >
                  Launch Platform
                </Button>
              </Link>
            </div>

            {/* Mobile hamburger button */}
            <div className="flex xl:hidden items-center gap-2">
              <Link to="/app">
                <Button variant="primary" size="xs" className="bg-[#102F24] text-white">
                  Launch App
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
          <div className="xl:hidden border-t border-[#E4D2BF] bg-[#FAF8F3] px-4 pt-3 pb-6 space-y-2 animate-fadeIn font-sans">
            <div className="p-3 rounded-2xl bg-[#FAF5EF] border border-[#E4D2BF] flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E99A43]" />
                <span className="text-xs font-bold text-[#102F24]">Public Portal Navigation</span>
              </div>
              <Link
                to="/app"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1 rounded-lg bg-[#102F24] text-white text-xs font-bold shadow-xs font-mono"
              >
                Launch App →
              </Link>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`#${link.hashId}`}
                onClick={(e) => handleNavClick(link.hashId, e)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#17251E] hover:text-[#102F24] hover:bg-[#FAF5EF] transition-colors"
              >
                {link.name}
              </a>
            ))}

            <div className="pt-3 border-t border-[#E4D2BF] flex items-center gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white text-[#102F24] hover:bg-[#FAF5EF] text-xs font-bold text-center border border-[#E4D2BF]"
              >
                Sign In
              </Link>
              <Link
                to="/app"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#102F24] text-white text-xs font-bold text-center font-mono"
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
