import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  TrendingUp,
  AlertOctagon,
  ArrowRight,
  Shield,
  Layers,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../common/Button';
import { hotspotService } from '../../services/hotspotService';
import { analyticsService } from '../../services/analyticsService';

export function HotspotSection() {
  const [hotspots, setHotspots] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [hot, cat] = await Promise.all([
          hotspotService.getHotspots(),
          analyticsService.getCategoryBreakdown(),
        ]);
        setHotspots(hot || []);
        setCategories(cat || []);
      } catch (e) {
        console.error('Failed to load hotspot intelligence data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <section id="hotspots-intel" className="py-20 sm:py-32 bg-[#F8F6F0] border-b border-[#183D2B]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183D2B]/10 border border-[#183D2B]/20 text-[#102F24] font-mono text-[11px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            Hotspot Intelligence
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#102F24] tracking-tight leading-tight">
            Don't just identify waste. <br />
            <span className="text-[#183D2B] font-serif italic">Understand where it keeps returning.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#17251E]/80 font-sans leading-relaxed">
            Traditional municipal management treats every pile of trash as an isolated incident.
            Vasundhara AI uses spatial recurrence algorithms to identify structural dump hotspots and eliminate root causes.
          </p>
        </div>

        {/* Hotspot Cards & Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Top Priority Hotspots Ranking */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#183D2B]/15">
              <span className="text-xs font-mono font-bold text-[#102F24] uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-600" />
                Priority Ranked Environmental Clusters
              </span>
              <span className="text-xs font-mono text-[#183D2B] font-bold">
                Formula: Frequency × Volume × EcoRisk
              </span>
            </div>

            <div className="space-y-3.5">
              {hotspots.slice(0, 3).map((h, idx) => (
                <div
                  key={h.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-[#183D2B]/15 hover:border-[#183D2B]/40 shadow-soft-sm transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[#EFE9DD] text-[#102F24] font-mono font-bold text-xs flex items-center justify-center">
                        0{idx + 1}
                      </span>
                      <h4 className="text-base font-bold text-[#102F24]">{h.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold border border-rose-200">
                        SCORE {h.priorityScore}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sage-100 text-[#102F24] font-bold">
                        {h.trend}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#17251E]/80 font-sans mb-3 leading-relaxed">
                    <b className="text-[#102F24]">Ecological Risk:</b> {h.environmentalRisk}
                  </p>

                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#183D2B]/10 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[#183D2B] font-bold">Action: {h.suggestedAction}</span>
                    <span className="text-[#17251E]/60 text-[11px] shrink-0">
                      {h.recurrenceCount} Dumps Logged
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link to="/hotspots">
                <Button
                  variant="outline"
                  size="md"
                  icon={Flame}
                  className="w-full sm:w-auto text-[#102F24] border-[#183D2B]/30 hover:border-[#183D2B]"
                >
                  Inspect Full Hotspot Intelligence Hub →
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Category Breakdown & Risk Distribution */}
          <div className="lg:col-span-5 space-y-6">
            {/* Category Breakdown Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#183D2B]/15 shadow-soft-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#183D2B]/10 pb-3">
                <span className="text-xs font-mono font-bold text-[#102F24] uppercase flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#183D2B]" />
                  Waste Material Spectrum
                </span>
                <span className="text-[10px] font-mono text-[#183D2B] font-bold">
                  MAHARASHTRA CITIES
                </span>
              </div>

              <div className="space-y-3.5">
                {categories.map((cat) => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-[#17251E]">{cat.name}</span>
                      <span className="font-mono font-bold text-[#102F24]">{cat.value}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#EFE9DD] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#183D2B]/10 text-xs text-[#17251E]/70 font-sans leading-relaxed">
                Single-use plastics and packaging account for 38% of recurrent hotspot volume,
                posing severe monsoon drain blockage hazards.
              </div>
            </div>

            {/* Sovereign Spatial Accuracy Card */}
            <div className="p-6 rounded-3xl bg-[#102F24] text-white border border-[#27403C] shadow-soft-md space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[#A9C7AE]">
                <span>MUNICIPAL PRIORITY ENGINE</span>
                <span className="text-[#E99A43]">ALGO v2.4</span>
              </div>
              <p className="text-xs text-[#EFE9DD]/90 leading-relaxed font-sans">
                Priority score integrates report density, recurrence frequency, proximity to primary water bodies,
                and school/hospital buffer zones.
              </p>
              <div className="pt-2 border-t border-white/10 text-[10px] text-[#A9C7AE]">
                ✓ Validated against Pune Municipal Corporation Ward Standards
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
