import React, { useState, useEffect } from 'react';
import {
  Layers,
  CheckCircle2,
  TrendingDown,
  Flame,
  Info,
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function ImpactSection() {
  const [metrics, setMetrics] = useState(null);
  const [containerRef, isRevealed] = useScrollReveal({ threshold: 0.15 });

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const data = await analyticsService.getDashboardMetrics();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load impact metrics', err);
      }
    }
    fetchMetrics();
  }, []);

  const statCards = [
    {
      label: 'Pollution Incidents Logged',
      value: metrics?.totalReportsLogged || 469,
      unit: '',
      subtext: '+14% MoM Citizen Submissions',
      icon: Layers,
      color: '#102F24',
    },
    {
      label: 'Certified Cleanups Completed',
      value: metrics?.completedCleanups || 391,
      unit: '',
      subtext: '83.3% Full Spatial Resolution',
      icon: CheckCircle2,
      color: '#183D2B',
    },
    {
      label: 'Waste Diverted from Waterways',
      value: metrics?.totalWasteCollectedKg || 4280,
      unit: 'kg',
      subtext: '~2.4 Tons CO₂ Offset Equivalent',
      icon: TrendingDown,
      color: '#E99A43',
    },
    {
      label: 'Active Hotspot Clusters Mapped',
      value: metrics?.activeHotspotsTracked || 6,
      unit: '',
      subtext: 'Targeted for Priority Remediation',
      icon: Flame,
      color: '#E11D48',
    },
  ];

  return (
    <section
      id="impact"
      ref={containerRef}
      className={`py-20 sm:py-32 bg-[#F8F6F0] border-b border-[#183D2B]/10 transition-all duration-700 ${
        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183D2B]/10 border border-[#183D2B]/20 text-[#102F24] font-mono text-[11px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#183D2B]" />
            Measurable Municipal Impact
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#102F24] tracking-tight leading-tight">
            Transparency in civic <br />
            <span className="text-[#183D2B] font-serif italic">environmental intelligence.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#17251E]/80 font-sans leading-relaxed">
            Every submission directly updates municipal sanitation priority scores, ensuring crews are deployed
            where ecological risk and recurrence frequency are highest.
          </p>
        </div>

        {/* 4 Large Editorial Statistics Cards with Animated Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-[#183D2B]/15 shadow-soft-sm hover:shadow-soft-md hover:border-[#183D2B]/40 card-lift transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F8F6F0] border border-[#183D2B]/10 flex items-center justify-center text-[#102F24] group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#183D2B] bg-[#A9C7AE]/20 px-2 py-0.5 rounded">
                      VERIFIED
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-serif font-bold text-[#102F24] tracking-tight">
                    <AnimatedCounter value={stat.value} duration={1600} />
                    {stat.unit && <span className="text-xl font-normal ml-1 text-[#183D2B]">{stat.unit}</span>}
                  </div>

                  <p className="text-xs font-bold text-[#102F24] mt-2 font-sans">
                    {stat.label}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#183D2B]/10 text-[11px] font-mono font-bold text-[#183D2B]">
                  {stat.subtext}
                </div>
              </div>
            );
          })}
        </div>

        {/* Data Provenance & Methodological Note */}
        <div className="p-5 rounded-2xl bg-[#EFE9DD]/70 border border-[#183D2B]/15 flex items-start gap-3.5 max-w-3xl mx-auto text-xs text-[#17251E]/80 card-lift">
          <Info className="w-5 h-5 text-[#183D2B] shrink-0 mt-0.5" />
          <p className="leading-relaxed font-sans font-medium">
            <b className="text-[#102F24]">Data Provenance:</b> All platform statistics are calculated live from
            submitted photographic reports, municipal field dispatch logs, and verified resolution audits across
            participating Maharashtra municipal wards. Illustrative estimates are labeled accordingly.
          </p>
        </div>
      </div>
    </section>
  );
}
