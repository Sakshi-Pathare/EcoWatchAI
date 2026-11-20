import React from 'react';
import { EyeOff, Repeat, MapPinOff, Clock, ShieldAlert } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function ProblemSection() {
  const [containerRef, isRevealed] = useScrollReveal({ threshold: 0.1 });
  const problems = [
    {
      number: '01',
      title: 'Scattered Citizen Reporting',
      lead: 'Fragmented channels create critical blind spots.',
      description:
        'Citizens submit grievances across unconnected social platforms, informal phone hotlines, and manual paper registries. Without central spatial deduplication, municipal agencies waste hours addressing duplicate notices while chronic dump zones go undetected.',
      metric: '68% of civic alerts',
      metricLabel: 'lack verifiable geographic coordinates in traditional hotlines',
      icon: EyeOff,
    },
    {
      number: '02',
      title: 'Recurring Waste Accumulation',
      lead: 'Cleaned once, overflowing again within 48 hours.',
      description:
        'Without recurrence pattern detection, street sweeping remains purely reactive. The same market corners, drainage culverts, and transit margins repeatedly accumulate illegal debris because underlying behavioral or capacity deficits are never diagnosed.',
      metric: 'Top 5% dump sites',
      metricLabel: 'absorb over 40% of total emergency municipal sanitation budget',
      icon: Repeat,
    },
    {
      number: '03',
      title: 'Lack of Geographical Intelligence',
      lead: 'Blind municipal patrols without spatial clustering.',
      description:
        'Sanitation vehicles follow fixed, rigid calendar routes rather than dynamically routing toward high-density pollution clusters. Environmental vulnerability near river basins and stormwater corridors remains disconnected from dispatch priorities.',
      metric: '180+ hours monthly',
      metricLabel: 'lost to misrouted sanitation sweeps without spatial clustering',
      icon: MapPinOff,
    },
    {
      number: '04',
      title: 'Difficulty Tracking Municipal Action',
      lead: 'Dispatches vanish into an opaque operational pipeline.',
      description:
        'Once a citizen files a complaint, tracking status requires manual inquiries. Field supervisors lack turn-by-turn navigation coordinates to specific dump sites, leading to delayed arrivals and unresolved complaints.',
      metric: '5 to 10 days',
      metricLabel: 'average turnaround time from complaint to crew dispatch',
      icon: Clock,
    },
    {
      number: '05',
      title: 'Limited Resolution Accountability',
      lead: 'No photographic audit means unverifiable resolution.',
      description:
        'Work orders are frequently marked as "completed" on paper registers without photographic evidence or GPS verification. Citizens never receive transparent proof that their reported issues were remediated, eroding public trust in urban environmental governance.',
      metric: '82% of closed tickets',
      metricLabel: 'lack photographic before-and-after resolution proof',
      icon: ShieldAlert,
    },
  ];

  return (
    <section
      id="about-intro"
      ref={containerRef}
      className={`py-20 sm:py-32 bg-[#F8F6F0] border-b border-[#183D2B]/10 relative transition-all duration-700 ${
        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183D2B]/10 border border-[#183D2B]/20 text-[#102F24] font-mono text-[11px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E99A43]" />
            The Urban Challenge
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#102F24] tracking-tight leading-tight">
            Environmental problems don't disappear. <br />
            <span className="text-[#183D2B]/90 font-serif italic">They repeat.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#17251E]/80 font-sans leading-relaxed">
            Across Indian cities, municipal sanitation teams struggle not with a lack of goodwill, but with
            fragmented signals, recurring dump zones, and zero geospatial auditability.
          </p>
        </div>

        {/* 5 Editorial Problem Blocks in a Staggered Editorial Layout */}
        <div className="space-y-8 sm:space-y-12">
          {problems.map((p, index) => {
            const Icon = p.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={p.number}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 rounded-3xl bg-white border border-[#183D2B]/10 shadow-soft-sm hover:border-[#183D2B]/30 card-lift transition-all"
              >
                {/* Problem Description */}
                <div className={`lg:col-span-7 space-y-3 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-3xl font-bold text-[#E99A43]/90">
                      {p.number}
                    </span>
                    <span className="h-4 w-[1px] bg-[#183D2B]/20" />
                    <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#183D2B] bg-[#A9C7AE]/20 px-2.5 py-0.5 rounded-md">
                      Structural Bottleneck
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#102F24]">
                    {p.title}
                  </h3>

                  <p className="text-sm sm:text-base font-semibold text-[#183D2B] leading-snug">
                    {p.lead}
                  </p>

                  <p className="text-sm text-[#17251E]/80 leading-relaxed font-sans">
                    {p.description}
                  </p>
                </div>

                {/* Editorial Metric Card */}
                <div className={`lg:col-span-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="p-6 sm:p-7 rounded-2xl bg-[#EFE9DD]/60 border border-[#183D2B]/15 relative overflow-hidden">
                    <div className="absolute top-4 right-4 text-[#183D2B]/15">
                      <Icon className="w-16 h-16" />
                    </div>

                    <div className="space-y-2 relative z-10">
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#183D2B]">
                        Diagnostic Field Benchmark
                      </span>
                      <div className="text-2xl sm:text-3xl font-mono font-bold text-[#102F24] leading-tight">
                        {p.metric}
                      </div>
                      <p className="text-xs text-[#17251E]/80 font-medium leading-relaxed">
                        {p.metricLabel}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#183D2B]/10 flex items-center justify-between text-[11px] font-mono text-[#102F24]">
                      <span>CHRONIC DEFICIENCY</span>
                      <span className="text-rose-700 font-bold">UNRESOLVED</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
