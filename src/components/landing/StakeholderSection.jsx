import React from 'react';
import { Users, Building2, BarChart2, HeartHandshake, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function StakeholderSection() {
  const stakeholders = [
    {
      number: '01',
      title: 'Citizens & Civic Volunteers',
      role: 'Crowdsourced Ground Eyes',
      description:
        'Empowered with simple 30-second mobile photo capture. Citizens observe verified cleanup progress on their submissions, receive notifications upon resolution, and earn civic stewardship karma.',
      impact: 'Average report submission takes < 30 seconds with automatic GPS geocoding.',
      icon: Users,
      link: '/dashboard',
      linkText: 'Explore Citizen Portal',
    },
    {
      number: '02',
      title: 'Municipal Authorities & Squads',
      role: 'Sanitation Dispatch & Execution',
      description:
        'Sanitation inspectors and ward officers receive prioritized geospatial incident feeds. Instead of delayed telephone complaints, crews receive exact navigation coordinates and waste volume estimates.',
      impact: 'Reduces complaint dispatch latency from 5+ days down to under 24 hours.',
      icon: Building2,
      link: '/cleanups',
      linkText: 'Inspect Municipal Dispatch',
    },
    {
      number: '03',
      title: 'Environmental Administrators',
      role: 'Spatial Intelligence & Policy',
      description:
        'Urban planners and environmental engineers analyze recurrence heatmaps to identify chronic illegal dumping corridors, allocate infrastructure (trash booms, public bins), and benchmark ward performance.',
      impact: 'Data-driven budgeting prevents repeat dumps rather than funding perpetual sweeps.',
      icon: BarChart2,
      link: '/hotspots',
      linkText: 'View Hotspot Analytics',
    },
    {
      number: '04',
      title: 'Urban Communities & Ecosystems',
      role: 'Public Hygiene & Flood Resilience',
      description:
        'Clean public parks, unblocked stormwater drains, and plastic-free riverbanks improve living standards for urban residents while mitigating catastrophic monsoon urban flooding.',
      impact: 'Prevents thousands of kilograms of single-use plastic from entering riverine basins.',
      icon: HeartHandshake,
      link: '/map',
      linkText: 'Explore Live Regional Map',
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-32 bg-[#FAF8F3] border-b border-[#183D2B]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183D2B]/10 border border-[#183D2B]/20 text-[#102F24] font-mono text-[11px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#183D2B]" />
            Ecosystem & Stakeholders
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#102F24] tracking-tight leading-tight">
            Designed for every stakeholder <br />
            <span className="text-[#183D2B] font-serif italic">in urban environmental stewardship.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#17251E]/80 font-sans leading-relaxed">
            Sustainable urban cleanliness cannot depend on citizens or governments alone.
            Vasundhara AI bridges all parties through shared spatial truth.
          </p>
        </div>

        {/* 4 Editorial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {stakeholders.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.number}
                className="p-6 sm:p-10 rounded-3xl bg-white border border-[#183D2B]/15 shadow-soft-sm hover:border-[#183D2B]/40 hover:shadow-soft-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-bold text-[#E99A43]">
                      {s.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#F8F6F0] text-[#102F24] flex items-center justify-center border border-[#183D2B]/10 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-[#183D2B]" />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#183D2B] block mb-1">
                      {s.role}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-[#102F24]">
                      {s.title}
                    </h3>
                  </div>

                  <p className="text-sm text-[#17251E]/80 leading-relaxed font-sans">
                    {s.description}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-[#183D2B]/10 space-y-3">
                  <div className="text-xs font-mono text-[#183D2B] font-bold">
                    Impact: {s.impact}
                  </div>
                  <Link
                    to={s.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#102F24] hover:text-[#183D2B] font-mono group/link"
                  >
                    <span>{s.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
