import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { HeroSection } from '../components/landing/HeroSection';
import { ProblemSection } from '../components/landing/ProblemSection';
import { SolutionSection } from '../components/landing/SolutionSection';
import { CapabilitiesSection } from '../components/landing/CapabilitiesSection';
import { WorkflowSection } from '../components/landing/WorkflowSection';
import { GISIntelligenceSection } from '../components/landing/GISIntelligenceSection';
import { HotspotSection } from '../components/landing/HotspotSection';
import { MunicipalActionSection } from '../components/landing/MunicipalActionSection';
import { TechnologySection } from '../components/landing/TechnologySection';
import { ImpactSection } from '../components/landing/ImpactSection';
import { PlatformPreviewSection } from '../components/landing/PlatformPreviewSection';
import { FinalCTASection } from '../components/landing/FinalCTASection';

export function LandingPage() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    analyticsService.getDashboardMetrics().then(setMetrics).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#12181A] font-sans selection:bg-[#102F24] selection:text-[#FAF8F3]">
      {/* SECTION 01 — HERO */}
      <HeroSection metrics={metrics} />

      {/* SECTION 02 — THE PROBLEM */}
      <ProblemSection />

      {/* SECTION 03 — OUR SOLUTION */}
      <SolutionSection />

      {/* SECTION 04 — PLATFORM CAPABILITIES */}
      <CapabilitiesSection />

      {/* SECTION 05 — HOW IT WORKS */}
      <WorkflowSection />

      {/* SECTION 06 — GIS INTELLIGENCE */}
      <GISIntelligenceSection />

      {/* SECTION 07 — HOTSPOT INTELLIGENCE */}
      <HotspotSection />

      {/* SECTION 08 — MUNICIPAL OPERATIONS */}
      <MunicipalActionSection />

      {/* SECTION 09 — TECHNOLOGY BEHIND VASUNDHARA */}
      <TechnologySection />

      {/* SECTION 10 — IMPACT AND BENEFITS */}
      <ImpactSection />

      {/* SECTION 11 — PLATFORM PREVIEW */}
      <PlatformPreviewSection />

      {/* SECTION 12 — FINAL CALL TO ACTION */}
      <FinalCTASection />
    </div>
  );
}
