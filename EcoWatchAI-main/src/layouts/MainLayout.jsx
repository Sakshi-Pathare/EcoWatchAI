import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ApiConnectionNotice } from '../components/common/ApiConnectionNotice';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8F5] text-charcoal">
      <Navbar />
      <ApiConnectionNotice />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

