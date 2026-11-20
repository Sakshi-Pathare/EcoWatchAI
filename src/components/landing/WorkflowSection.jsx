import React, { useState } from 'react';
import { Camera, Cpu, Layers, CheckCircle2, MapPin, Upload, Eye, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export function WorkflowSection() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps = [
    {
      stepNumber: '01',
      title: 'Report',
      headline: 'Citizens capture photographic evidence in under 30 seconds.',
      description:
        'Using any smartphone or mobile browser, volunteers and residents capture photo evidence of illegal dumps, overflowing bins, or roadside debris. The platform extracts authentic GPS coordinates and matches the nearest Maharashtra municipal ward.',
      badgeText: 'Field Geotagging',
      mockVisual: {
        type: 'camera',
        header: 'Citizen Litter Report • Camera Capture',
        coordinates: '18.5222° N, 73.8415° E (Deccan Gymkhana)',
        meta: ['Auto-Exif Timestamp: Active', 'Ward: PMC Ward 12', 'Resolution: 4032x3024 HDR'],
        status: 'GPS Locked & Verified',
      },
    },
    {
      stepNumber: '02',
      title: 'Analyse',
      headline: 'The system processes reports and identifies material severity.',
      description:
        'Submitted photographs undergo automated processing. Material composition (plastics, glass, hazardous waste) is cataloged, severity weighting is computed, and duplicate submissions in the same radius are automatically merged.',
      badgeText: 'AI-Assisted Vision',
      mockVisual: {
        type: 'vision',
        header: 'Computer Vision Processing • YOLOv8 Engine',
        coordinates: 'Confidence: 98.4% • Severity: High Priority',
        meta: ['PET Plastics: 14 items (82%)', 'Aluminum Cans: 6 items (18%)', 'Estimated Weight: 15-20 kg'],
        status: 'Phase 2 YOLOv8 Model Staged',
      },
    },
    {
      stepNumber: '03',
      title: 'Identify Hotspots',
      headline: 'Spatial clustering uncovers recurring chronic pollution corridors.',
      description:
        'Rather than treating dumps in isolation, the spatial engine groups incidents within a 200m–500m radius. Multi-factor recurrence formulas assign high priority scores to sites near waterways, drainage outlets, and pedestrian zones.',
      badgeText: 'Hotspot Clustering',
      mockVisual: {
        type: 'clustering',
        header: 'Spatial Density Radar • Recurrence Cluster',
        coordinates: 'Cluster: HOT-PN-01 (Mutha Riverbed Basin)',
        meta: ['Recurrence Count: 38 Incidents', 'Priority Score: 96 / 100', 'Ecological Risk: Marine/River Buffer'],
        status: 'Priority Dispatch Required',
      },
    },
    {
      stepNumber: '04',
      title: 'Take Action',
      headline: 'Municipal crews remediate and certify with before/after photos.',
      description:
        'Municipal authorities dispatch rapid sanitation squads directly to the geocoded location. After cleaning, field supervisors upload verified after-photos to close the work order and notify reporting citizens.',
      badgeText: 'Audited Resolution',
      mockVisual: {
        type: 'audit',
        header: 'Municipal Work Order • Before / After Audit',
        coordinates: 'Task: CLN-801 • PMC Rapid Sanitation Squad',
        meta: ['Crew: Suresh Gaikwad (Lead)', 'Status: Remediated & Certified', 'Audit Verification: Approved by Inspector'],
        status: 'Resolution Rate: 94.2%',
      },
    },
  ];

  const currentStep = steps[activeStepIndex];

  return (
    <section id="how-it-works" className="py-20 sm:py-32 bg-[#FAF8F3] border-b border-[#183D2B]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183D2B]/10 border border-[#183D2B]/20 text-[#102F24] font-mono text-[11px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#183D2B]" />
            How It Works
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#102F24] tracking-tight leading-tight">
            A continuous loop from <br />
            <span className="text-[#183D2B] font-serif italic">citizen reporting to verified resolution.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#17251E]/80 font-sans leading-relaxed">
            Experience our 4-step municipal operational pipeline. Select any stage to inspect how raw reports
            transform into certified clean city streets.
          </p>
        </div>

        {/* Step Navigation Tabs (Horizontal on Desktop, Scrollable on Mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {steps.map((st, idx) => {
            const isActive = activeStepIndex === idx;
            return (
              <button
                key={st.stepNumber}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-4 sm:p-5 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#102F24] text-white border-[#183D2B] shadow-soft-md'
                    : 'bg-white text-[#17251E] border-[#183D2B]/15 hover:border-[#183D2B]/40 hover:bg-[#F8F6F0]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                      isActive ? 'bg-[#183D2B] text-[#A9C7AE]' : 'bg-[#EFE9DD] text-[#102F24]'
                    }`}
                  >
                    STEP {st.stepNumber}
                  </span>
                  <span className={`text-[11px] font-mono ${isActive ? 'text-[#A9C7AE]' : 'text-[#183D2B]'}`}>
                    {st.badgeText}
                  </span>
                </div>
                <div className={`font-serif font-bold text-lg sm:text-xl ${isActive ? 'text-white' : 'text-[#102F24]'}`}>
                  {st.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Step Detail Card */}
        <div className="rounded-3xl bg-white border border-[#183D2B]/15 p-6 sm:p-12 shadow-soft-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Step Explanations */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-3xl font-bold text-[#E99A43]">
                  STEP {currentStep.stepNumber}
                </span>
                <span className="h-4 w-[1px] bg-[#183D2B]/20" />
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#183D2B]">
                  {currentStep.badgeText}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#102F24] leading-snug">
                {currentStep.headline}
              </h3>

              <p className="text-sm sm:text-base text-[#17251E]/80 font-sans leading-relaxed">
                {currentStep.description}
              </p>

              <div className="pt-2">
                <span className="text-xs font-mono text-[#183D2B] font-bold inline-flex items-center gap-1.5 bg-[#A9C7AE]/20 px-3 py-1.5 rounded-lg border border-[#A9C7AE]/40">
                  <ShieldCheck className="w-4 h-4 text-[#183D2B]" />
                  Operational Status: {currentStep.mockVisual.status}
                </span>
              </div>
            </div>

            {/* Right: Operational Telemetry Visual Box */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-[#102F24] text-white p-6 sm:p-8 font-mono border border-[#27403C] shadow-soft-lg space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
                  <span className="text-[#A9C7AE] font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E99A43] animate-ping" />
                    {currentStep.mockVisual.header}
                  </span>
                  <span className="text-[10px] bg-[#183D2B] text-white px-2 py-0.5 rounded-full">
                    LIVE TRACE
                  </span>
                </div>

                <div className="bg-[#183D2B] p-3.5 rounded-xl border border-[#27403C] text-xs space-y-1">
                  <span className="text-[#A9C7AE] text-[10px] block">GEOSPATIAL TAG:</span>
                  <div className="text-white font-bold">{currentStep.mockVisual.coordinates}</div>
                </div>

                <div className="space-y-2 text-xs text-[#EFE9DD]/90 pt-1">
                  {currentStep.mockVisual.meta.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[#A9C7AE]">›</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#A9C7AE]">
                  <span>VASUNDHARA OS • KERNEL v2.4</span>
                  <span className="text-emerald-400 font-bold">✓ PASSING INTEGRITY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
