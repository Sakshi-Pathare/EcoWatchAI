import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

/**
 * AppLayout — Stage 2: Functional Environmental Intelligence Application
 * 
 * Features a subtle, elegant botanical leaves background texture (12-14% opacity)
 * with a warm ivory / light sage overlay behind all operational application views,
 * while preserving 100% solid opacity and contrast for all content, cards, and forms.
 */
export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#17251E] selection:bg-[#102F24] selection:text-[#FAF8F3] relative isolate">
      {/* Botanical Leaves Background Layer (Fixed behind all application content) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      >
        {/* Layer 1: Base Warm Ivory Canvas */}
        <div className="absolute inset-0 bg-[#FAF8F3]" />

        {/* Layer 2: Subtle Botanical Leaves Image Texture */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat sm:bg-fixed opacity-[0.13] transition-opacity"
          style={{
            backgroundImage: "url('/images/sidebar-botanical-vertical.jpg')",
          }}
        />

        {/* Layer 3: Warm Ivory & Light Sage Soft Gradient Overlay for Readability */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#FAF8F3]/50 via-transparent to-[#FAF8F3]/70"
        />
      </div>

      {/* Navigation (Sticky above background) */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Main Operational Application Views (Rendered above botanical background) */}
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      {/* Footer (Rendered above botanical background) */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}
