import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { UserDashboard } from './pages/UserDashboard';
import { ReportLitterPage } from './pages/ReportLitterPage';
import { PollutionMapPage } from './pages/PollutionMapPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { HotspotIntelligencePage } from './pages/HotspotIntelligencePage';
import { CleanupManagementPage } from './pages/CleanupManagementPage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { SuperAdminPage } from './pages/SuperAdminPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/map" element={<PollutionMapPage />} />
            <Route path="/dashboard" element={<ProtectedRoute roles={['citizen']}><UserDashboard /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute roles={['citizen']}><ReportLitterPage /></ProtectedRoute>} />
            <Route path="/my-reports" element={<ProtectedRoute roles={['citizen']}><MyReportsPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute roles={['municipal_admin', 'super_admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/hotspots" element={<HotspotIntelligencePage />} />
            <Route path="/cleanups" element={<ProtectedRoute roles={['municipal_admin', 'super_admin']}><CleanupManagementPage /></ProtectedRoute>} />
            <Route path="/superadmin" element={<ProtectedRoute roles={['super_admin']}><SuperAdminPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

