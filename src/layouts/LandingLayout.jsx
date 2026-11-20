import React from 'react';
import { Outlet } from 'react-router-dom';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingFooter } from '../components/landing/LandingFooter';

export function LandingLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#12181A] selection:bg-[#102F24] selection:text-[#FAF8F3]">
      <LandingNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  );
}
