import React from 'react';
import {
  Code2,
  Server,
  MapPin,
  Cpu,
  BarChart3,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function TechnologySection() {
  const [containerRef, isRevealed] = useScrollReveal({ threshold: 0.1 });

  const techStack = [
    {
      title: 'React 18 & Vite',
      role: 'Frontend Presentation & UI Runtime',
      desc: 'Sub-second page rendering, component modularity, responsive design, and smooth geospatial state transitions with Tailwind CSS.',
      spec: 'ESM Modules • Instant HMR • Strict Mode Safe',
      icon: Code2,
      tag: 'CLIENT CORE',
    },
    {
      title: 'FastAPI & Python',
      role: 'High-Throughput Backend Microservices',
      desc: 'Asynchronous REST APIs handling incident submissions, automated EXIF parsing, and spatial query indexing with Python data scientific libraries.',
      spec: 'Python 3.11 • AsyncIO • Pydantic Schema Validation',
      icon: Server,
      tag: 'BACKEND SERVICES',
    },
    {
      title: 'OpenStreetMap & Leaflet',
      role: 'Sovereign Geospatial Cartography',
      desc: 'Decoupled from commercial proprietary map licensing. Full vector tile streaming, custom incident markers, and offline-resilient map layers.',
      spec: 'Open-Source Tiles • Nominatim Reverse Geocoding',
      icon: MapPin,
      tag: 'MAPPING ENGINE',
    },
    {
      title: 'YOLO-Based Image Detection',
      role: 'Computer Vision Inference (Staged)',
      desc: 'Deep convolutional inference trained on urban refuse datasets to classify recyclable plastics, glass, metals, and hazardous items.',
      spec: 'YOLOv8 Ultralytics • 98.4% Confidence Benchmark',
      icon: Cpu,
      tag: 'VISION AI',
    },
    {
      title: 'Geospatial Clustering',
      role: 'Proximity Hotspot Algorithm',
      desc: 'DBSCAN-inspired spatial grouping calculates recurrence radius, merging duplicate notices and flagging chronic dump corridors.',
      spec: 'Adaptive Radius (150-350m) • Multi-factor Scoring',
      icon: Layers,
      tag: 'SPATIAL ALGORITHMS',
    },
    {
      title: 'Recharts Engine',
      role: 'Dynamic Operational Analytics',
      desc: 'Composable SVG visualization engine charting monthly municipal trends, category breakdowns, and SLA resolution performance.',
      spec: 'Declarative SVG • Responsive Container • 60 FPS',
      icon: BarChart3,
      tag: 'DATA VISUALIZATION',
    },
  ];

  return (
    <section
      id="technology"
      ref={containerRef}
      className={`py-20 sm:py-32 bg-[#FAF8F3] text-[#17251E] border-b border-[#E4D2BF] relative overflow-hidden transition-all duration-700 ${
        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF5EF] border border-[#E4D2BF] text-[#183D2B] font-mono text-[11px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E99A43]" />
            Technology Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#102F24] tracking-tight leading-tight">
            Engineered for sovereign, <br />
            <span className="text-[#183D2B] font-serif italic">uncompromised civic intelligence.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#17251E]/80 font-sans leading-relaxed">
            Vasundhara AI relies on authentic, production-proven open technologies.
            No vaporware. No proprietary lock-in. Just resilient software architecture built for Indian municipal scale.
          </p>
        </div>

        {/* 6 Tech Cards Grid in Crisp White / Skin Beige */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.title}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E4D2BF] hover:border-[#183D2B]/50 shadow-soft-sm card-lift transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-[#FAF5EF] text-[#183D2B] flex items-center justify-center border border-[#E4D2BF] group-hover:scale-105 transition-transform shadow-xs">
                      <Icon className="w-5 h-5 text-[#183D2B]" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FAF5EF] text-[#183D2B] border border-[#E4D2BF]">
                      {tech.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#102F24] mb-1">
                      {tech.title}
                    </h3>
                    <span className="text-xs font-mono text-[#183D2B] block mb-2 font-bold">
                      {tech.role}
                    </span>
                    <p className="text-xs text-[#17251E]/75 leading-relaxed font-sans">
                      {tech.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E4D2BF] font-mono text-[11px] text-[#183D2B] font-bold">
                  ✓ {tech.spec}
                </div>
              </div>
            );
          })}
        </div>

        {/* Architectural Integrity Guarantee Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E4D2BF] shadow-soft-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 font-sans card-lift">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#183D2B] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#183D2B]" />
              Data Sovereignty & Open Standards
            </span>
            <p className="text-sm text-[#17251E]/80 font-medium">
              All incident records, coordinates, and photographic audits can be exported via GeoJSON, Shapefiles, or CSV for integration into existing municipal GIS databases.
            </p>
          </div>
          <div className="text-xs font-mono text-[#183D2B] font-bold shrink-0 bg-[#FAF5EF] px-4 py-2.5 rounded-xl border border-[#E4D2BF]">
            API SPEC: REST / JSON / GeoJSON
          </div>
        </div>
      </div>
    </section>
  );
}
