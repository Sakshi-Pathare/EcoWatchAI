import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA] text-[#17251E] selection:bg-[#102F24] selection:text-[#FAF8F3]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
