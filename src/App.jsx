import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
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
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/report" element={<ReportLitterPage />} />
            <Route path="/map" element={<PollutionMapPage />} />
            <Route path="/my-reports" element={<MyReportsPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/hotspots" element={<HotspotIntelligencePage />} />
            <Route path="/cleanups" element={<CleanupManagementPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
