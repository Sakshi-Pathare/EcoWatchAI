import React, { useState } from 'react';
import { Camera, Cpu, Layers, CheckSquare, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export function IntroductionSection() {
  const [activeStep, setActiveStep] = useState(0);

  const pipelineStages = [
    {
      id: 'citizen',
      label: 'Citizen Reports',
      sub: 'Crowdsourced Telemetry',
      icon: Camera,
      badge: 'Input Phase',
      tag: '01. INPUT',
      color: '#A9C7AE',
      details:
        'Citizens capture high-resolution photos of uncollected waste or public dumping. The system cryptographically seals GPS metadata, timestamps, and address data at the moment of capture.',
      telemetry: 'EXIF GPS verification • Real-time coordinate binding • Instant citizen karma attribution',
    },
    {
      id: 'ai',
      label: 'AI-Assisted Analysis',
      sub: 'Material & Severity Grading',
      icon: Cpu,
      badge: 'Classification',
      tag: '02. PROCESSING',
      color: '#E99A43',
      details:
        'Submitted imagery passes through computer vision inference to detect material categories (plastics, hazardous materials, mixed refuse) and estimate volumetric waste impact.',
      telemetry: 'YOLOv8 staged pipeline • 98.4% category confidence • Automatic severity weight assignment',
    },
    {
      id: 'gis',
      label: 'GIS Hotspot Intelligence',
      sub: 'Spatial Density Clustering',
      icon: Layers,
      badge: 'Geospatial Core',
      tag: '03. INTELLIGENCE',
      color: '#74D7CB',
      details:
        'Geospatial density algorithms aggregate nearby incidents into dynamic hotspot clusters. High-recurrence dump corridors receive elevated priority scores on municipal operations maps.',
      telemetry: 'DBSCAN proximity clustering • Multi-factor risk calculation • 24h recurrence alert trigger',
    },
    {
      id: 'municipal',
      label: 'Municipal Action',
      sub: 'Audited Resolution',
      icon: CheckSquare,
      badge: 'Execution',
      tag: '04. RESOLUTION',
      color: '#51C4B5',
      details:
        'Municipal sanitation dispatchers route work orders directly to field squads with exact navigation coordinates. Cleanup crews submit verified after-photos to certify complete remediation.',
      telemetry: 'Automated work order creation • Zonal squad dispatch • Verified before/after photographic audit',
    },
  ];

  return (
    <section id="mission-arch" className="py-24 sm:py-32 bg-[#102F24] text-white relative overflow-hidden">
      {/* Background Subtle Ambient Glow & Grid */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#183D2B]/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern-dense opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183D2B] border border-[#A9C7AE]/30 text-[#A9C7AE] font-mono text-[11px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E99A43] animate-pulse" />
            Introducing Vasundhara AI
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
            From individual reports <br />
            <span className="text-[#A9C7AE] font-serif italic">to environmental intelligence.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#EFE9DD]/80 font-sans max-w-2xl mx-auto leading-relaxed font-normal">
            Vasundhara AI connects citizens, environmental data, geospatial intelligence, and municipal
            operations through one unified digital platform.
          </p>
        </div>

        {/* 4 Connected Stages: Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative mb-12">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = activeStep === idx;

            return (
              <div
                key={stage.id}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative group ${
                  isSelected
                    ? 'bg-[#183D2B] border-[#A9C7AE] shadow-[0_0_24px_rgba(169,199,174,0.25)] translate-y-[-2px]'
                    : 'bg-[#12362E]/70 border-[#23584E]/70 hover:bg-[#183D2B]/70 hover:border-[#A9C7AE]/50'
                }`}
              >
                {/* Step Connector Arrow (Desktop) */}
                {idx < 3 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-[#102F24] border border-[#A9C7AE]/40 items-center justify-center text-[#A9C7AE]">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: `${stage.color}20`,
                      borderColor: stage.color,
                      color: stage.color,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-[#EFE9DD]">
                    {stage.tag}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-lg text-white mb-1">{stage.label}</h4>
                <p className="text-xs text-[#A9C7AE] font-mono mb-3">{stage.sub}</p>

                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${isSelected ? 'w-full' : 'w-0'}`}
                    style={{ backgroundColor: stage.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Interactive Telemetry Showcase */}
        <div className="rounded-3xl bg-[#183D2B] border border-[#A9C7AE]/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#E99A43] uppercase tracking-wider">
                <Zap className="w-4 h-4 text-[#E99A43]" />
                Interactive Stage Inspector • Stage 0{activeStep + 1}
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {pipelineStages[activeStep].label}
              </h3>

              <p className="text-sm sm:text-base text-[#EFE9DD]/90 leading-relaxed font-sans">
                {pipelineStages[activeStep].details}
              </p>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-[#102F24] text-[#A9C7AE] border border-[#A9C7AE]/30">
                  {pipelineStages[activeStep].telemetry}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-[#102F24] border border-[#A9C7AE]/20 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] text-[#A9C7AE] border-b border-white/10 pb-2">
                  <span>TELEMETRY STACK: ACTIVE</span>
                  <span className="text-[#E99A43]">PHASE-VERIFIED</span>
                </div>
                <div className="space-y-1.5 text-white/90 text-[11px]">
                  <p>› Latency: &lt;180ms pipeline transit</p>
                  <p>› Geocoding: OpenStreetMap Nominatim</p>
                  <p>› Clustering: Real-time spatial engine</p>
                  <p>› Audit: Cryptographic photo verification</p>
                </div>
                <div className="pt-2 text-[10px] text-[#A9C7AE]/70">
                  Ready for live municipal deployment across Maharashtra smart cities.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
