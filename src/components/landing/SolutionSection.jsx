import React, { useState } from 'react';
import { Camera, Cpu, Layers, CheckSquare, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function SolutionSection() {
  const [activeStage, setActiveStage] = useState(0);
  const [containerRef, isRevealed] = useScrollReveal({ threshold: 0.1 });

  const pillars = [
    {
      id: 'citizens',
      title: 'Citizens & Volunteers',
      role: 'Sovereign Civic Sensors',
      desc: 'Mobile-first photographic capture with cryptographic GPS tagging, offline caching, and instantaneous karma rewards.',
      icon: Camera,
      badge: '01. INPUT LAYER',
      color: '#183D2B',
    },
    {
      id: 'ai',
      title: 'AI-Assisted Analysis',
      role: 'Material & Severity Inference',
      desc: 'Computer vision classification categorizing single-use plastics, toxic e-waste, and organic refuse with volume estimation.',
      icon: Cpu,
      badge: '02. INTELLIGENCE LAYER',
      color: '#E99A43',
    },
    {
      id: 'gis',
      title: 'GIS Hotspot Engine',
      role: 'Spatial Proximity Clustering',
      desc: 'DBSCAN algorithms group incidents into recurring hotspot zones, calculating priority scores based on water buffer risk.',
      icon: Layers,
      badge: '03. CARTOGRAPHY LAYER',
      color: '#2F665F',
    },
    {
      id: 'municipal',
      title: 'Municipal Action',
      role: 'Audited Zonal Dispatch',
      desc: 'Sanitation work orders routed to rapid squads with turn-by-turn navigation and mandatory before-and-after photographic sign-off.',
      icon: CheckSquare,
      badge: '04. RESOLUTION LAYER',
      color: '#102F24',
    },
  ];

  return (
    <section
      id="mission"
      ref={containerRef}
      className={`py-20 sm:py-32 bg-[#FAF8F3] text-[#17251E] border-b border-[#E4D2BF] relative overflow-hidden transition-all duration-700 ${
        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF5EF] border border-[#E4D2BF] text-[#183D2B] font-mono text-[11px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E99A43] animate-pulse" />
            Our Unified Solution
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-[#102F24] leading-tight">
            One connected platform. <br />
            <span className="text-[#183D2B] font-serif italic">From reporting to resolution.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#17251E]/80 font-sans max-w-2xl mx-auto leading-relaxed font-normal">
            Vasundhara AI connects citizens, environmental data, geospatial intelligence, and municipal
            operations through one sovereign digital architecture.
          </p>
        </div>

        {/* System Architecture Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative mb-12">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            const isSelected = activeStage === idx;

            return (
              <div
                key={p.id}
                onClick={() => setActiveStage(idx)}
                className={`cursor-pointer rounded-2xl p-6 border transition-all duration-300 relative group card-lift ${
                  isSelected
                    ? 'bg-white border-[#183D2B] shadow-soft-md translate-y-[-2px]'
                    : 'bg-white/80 border-[#E4D2BF] hover:bg-white hover:border-[#183D2B]/50'
                }`}
              >
                {/* Horizontal Flow Connector Arrow */}
                {idx < 3 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-[#FAF8F3] border border-[#E4D2BF] items-center justify-center text-[#183D2B]">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center border shadow-xs transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: '#FAF5EF',
                      borderColor: '#E4D2BF',
                      color: p.color,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FAF5EF] text-[#183D2B] border border-[#E4D2BF]">
                    {p.badge}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-lg text-[#102F24] mb-1">{p.title}</h4>
                <p className="text-xs text-[#183D2B] font-mono mb-3">{p.role}</p>

                <p className="text-xs text-[#17251E]/75 leading-relaxed font-sans mb-4">
                  {p.desc}
                </p>

                <div className="h-1.5 w-full bg-[#EFE3D5] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${isSelected ? 'w-full' : 'w-0'}`}
                    style={{ backgroundColor: p.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Architecture Inspection Console in Skin Beige / Warm Ivory */}
        <div className="rounded-3xl bg-white border border-[#E4D2BF] p-6 sm:p-10 shadow-soft-lg relative overflow-hidden card-lift">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#E99A43] uppercase tracking-wider">
                <Zap className="w-4 h-4 text-[#E99A43]" />
                System Integration Audit • {pillars[activeStage].badge}
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#102F24]">
                {pillars[activeStage].title}
              </h3>

              <p className="text-sm sm:text-base text-[#17251E]/80 leading-relaxed font-sans">
                {pillars[activeStage].desc} By structuring data from capture to resolution on a single
                immutable ledger, Vasundhara AI eliminates traditional municipal report loss and duplicate dispatches.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <Link to="/app">
                  <button className="px-5 py-2.5 rounded-xl bg-[#102F24] hover:bg-[#183D2B] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer hover-sheen">
                    Inspect in Operational App →
                  </button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-[#FAF5EF] border border-[#E4D2BF] font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] text-[#183D2B] border-b border-[#E4D2BF] pb-2">
                  <span className="font-bold">UNIFIED DATA MODEL</span>
                  <span className="text-[#E99A43] font-bold">v2.4 ACTIVE</span>
                </div>
                <div className="space-y-1.5 text-[#17251E] text-[11px]">
                  <p>› Citizen input: Camera + Geolocation payload</p>
                  <p>› Machine inference: Confidence & category grading</p>
                  <p>› Spatial indexing: Leaflet & OpenStreetMap engine</p>
                  <p>› Verification: Inspector before/after sign-off</p>
                </div>
                <div className="pt-2 text-[10px] text-[#183D2B]/80 font-medium">
                  Zero vendor lock-in • Fully sovereign smart-city environmental stack.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
