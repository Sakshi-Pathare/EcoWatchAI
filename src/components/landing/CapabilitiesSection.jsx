import React from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Cpu,
  MapPin,
  Flame,
  CheckSquare,
  FileCheck,
  BarChart3,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function CapabilitiesSection() {
  const [containerRef, isRevealed] = useScrollReveal({ threshold: 0.1 });
  const capabilities = [
    {
      id: 'reporting',
      number: '01',
      title: 'Citizen Incident Reporting',
      desc: 'Mobile-first capture with cryptographic EXIF geotagging, automatic nearest-ward binding, and offline submission fallback.',
      demo: 'EXIF GPS Locked • < 30s Capture • Karma Points Awarded',
      icon: Camera,
      link: '/report',
      linkText: 'Launch Report Wizard',
    },
    {
      id: 'ai-vision',
      number: '02',
      title: 'AI-Assisted Image Analysis',
      desc: 'Computer vision pipeline detecting single-use plastics, toxic e-waste, glass, and mixed organic debris with volume estimation.',
      demo: 'YOLOv8 Staged Pipeline • 98.4% Confidence • Material Tagging',
      icon: Cpu,
      link: '#technology',
      linkText: 'Inspect Tech Specs',
    },
    {
      id: 'gis-mapping',
      number: '03',
      title: 'Pollution GIS Mapping',
      desc: 'OpenStreetMap cartography visualizing litter incidents, active cleanups, satellite overlays, and regional city presets.',
      demo: 'Full Vector Tiles • Pune & Mumbai Regional Presets Active',
      icon: MapPin,
      link: '/map',
      linkText: 'Open Live GIS Map',
    },
    {
      id: 'hotspot-intel',
      number: '04',
      title: 'Hotspot Intelligence',
      desc: 'Density recurrence clustering identifying chronic dump corridors and calculating risk based on river/stormwater proximity.',
      demo: 'DBSCAN Proximity Engine • Multi-factor Scoring (0-100)',
      icon: Flame,
      link: '/hotspots',
      linkText: 'Explore Hotspot Hub',
    },
    {
      id: 'municipal-dispatch',
      number: '05',
      title: 'Municipal Cleanup Management',
      desc: 'Dispatches work orders directly to zonal sanitation crews with tonnage estimates, contact leads, and live progress milestones.',
      demo: 'Work Order Routing • Zonal Sanitary Inspector Sign-off',
      icon: CheckSquare,
      link: '/cleanups',
      linkText: 'View Cleanup Tasks',
    },
    {
      id: 'resolution-audit',
      number: '06',
      title: 'Before-and-After Resolution Auditing',
      desc: 'Mandatory geocoded post-remediation photographs certify task completion, providing undeniable proof to civic reporters.',
      demo: 'Side-by-Side Photographic Audit • 83.3% Full Resolution',
      icon: FileCheck,
      link: '/cleanups',
      linkText: 'Inspect Verified Audits',
    },
    {
      id: 'analytics-admin',
      number: '07',
      title: 'Analytics and Administration',
      desc: 'Executive command console for municipal directors: ward SLA tracking, contractor audits, and macro trend line forecasting.',
      demo: 'SLA Benchmarking • Role-Based Access • Immutable Log',
      icon: BarChart3,
      link: '/admin',
      linkText: 'Access Admin Console',
    },
  ];

  return (
    <section
      id="capabilities"
      ref={containerRef}
      className={`py-20 sm:py-32 bg-[#FAF8F3] border-b border-[#183D2B]/10 transition-all duration-700 ${
        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183D2B]/10 border border-[#183D2B]/20 text-[#102F24] font-mono text-[11px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#183D2B]" />
            Platform Capabilities
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#102F24] tracking-tight leading-tight">
            Seven operational modules. <br />
            <span className="text-[#183D2B] font-serif italic">One cohesive environmental OS.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#17251E]/80 font-sans leading-relaxed">
            Every module in Vasundhara AI addresses a specific phase of urban waste management,
            interconnecting citizen vigilance with professional municipal sanitation execution.
          </p>
        </div>

        {/* 7 Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.id}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-[#183D2B]/15 shadow-soft-sm hover:border-[#183D2B]/40 hover:shadow-soft-md card-lift transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#F8F6F0] text-[#102F24] flex items-center justify-center border border-[#183D2B]/10 group-hover:bg-[#102F24] group-hover:text-white transition-all shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#E99A43] bg-[#EFE9DD]/70 px-2.5 py-0.5 rounded-md">
                      MODULE {cap.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#102F24] mb-1.5">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-[#17251E]/80 leading-relaxed font-sans">
                      {cap.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#183D2B]/10 space-y-3">
                  <div className="p-2.5 rounded-xl bg-[#F8F6F0] border border-[#183D2B]/10 font-mono text-[11px] text-[#183D2B] font-bold">
                    {cap.demo}
                  </div>

                  {cap.link.startsWith('#') ? (
                    <a
                      href={cap.link}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#102F24] hover:text-[#183D2B] group/link cursor-pointer"
                    >
                      <span>{cap.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  ) : (
                    <Link
                      to={cap.link}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#102F24] hover:text-[#183D2B] group/link cursor-pointer"
                    >
                      <span>{cap.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
