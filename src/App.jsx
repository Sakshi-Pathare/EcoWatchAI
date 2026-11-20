import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LandingLayout } from './layouts/LandingLayout';
import { AppLayout } from './layouts/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { AppPortalPage } from './pages/AppPortalPage';
import { LoginPage } from './pages/LoginPage';
import { UserDashboard } from './pages/UserDashboard';
import { ReportLitterPage } from './pages/ReportLitterPage';
import { PollutionMapPage } from './pages/PollutionMapPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { HotspotIntelligencePage } from './pages/HotspotIntelligencePage';
import { CleanupManagementPage } from './pages/CleanupManagementPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* STAGE 1: Complete Public Landing Website */}
          <Route element={<LandingLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* STAGE 2: Functional Environmental Intelligence Application */}
          <Route element={<AppLayout />}>
            <Route path="/app" element={<AppPortalPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/report" element={<ReportLitterPage />} />
            <Route path="/map" element={<PollutionMapPage />} />
            <Route path="/my-reports" element={<MyReportsPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/superadmin" element={<Navigate to="/admin" replace />} />
            <Route path="/hotspots" element={<HotspotIntelligencePage />} />
            <Route path="/cleanups" element={<CleanupManagementPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
