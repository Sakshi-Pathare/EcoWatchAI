import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Compass,
  Radio,
  Flame,
  MapPin,
  Activity,
  CheckCircle2,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '../common/Button';

export function HeroSection({ metrics }) {
  const [activeTelemetryTab, setActiveTelemetryTab] = useState('hotspot'); // 'hotspot' | 'vision' | 'dispatch'

  const handleScrollToHowItWorks = (e) => {
    e.preventDefault();
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative pt-8 sm:pt-16 pb-20 sm:pb-32 overflow-hidden border-b border-[#183D2B]/15 bg-cover bg-center bg-no-repeat transition-all"
      style={{
        backgroundImage:
          "linear-gradient(rgba(248, 246, 240, 0.38), rgba(248, 246, 240, 0.38)), url('/images/vasundhara-theme-bg.png')",
      }}
    >
      {/* Subtle Indian Tricolor Hairline Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E99A43] via-white to-[#183D2B] opacity-90 z-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Editorial Headline, Eyebrow & Actions */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
            {/* Small Eyebrow: National Environmental Intelligence */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#183D2B]/20 shadow-soft-xs backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E99A43] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#183D2B]" />
              </span>
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#102F24] uppercase">
                Smart Environmental Intelligence | India
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#A9C7AE]/30 text-[#102F24] font-bold border border-[#A9C7AE]/60">
                v2.4 GIS
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-serif font-bold text-[#102F24] tracking-tight leading-[1.12]">
              Cleaner Cities <br />
              Begin With <br />
              <span className="text-[#183D2B] inline-block relative">
                Better Intelligence.
                <span className="absolute bottom-1.5 left-0 w-full h-2.5 bg-[#A9C7AE]/35 -z-10 rounded-sm" />
              </span>
            </h1>

            {/* Supporting Editorial Paragraph */}
            <p className="text-base sm:text-lg text-[#17251E]/90 leading-relaxed max-w-2xl font-sans font-medium">
              Transform citizen-reported environmental concerns into actionable geospatial intelligence,
              intelligent hotspot detection and accountable municipal action.
            </p>

            {/* Action Buttons: Explore Platform (/app) & Discover How It Works */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link to="/app">
                <Button
                  variant="primary"
                  size="lg"
                  icon={Compass}
                  className="w-full sm:w-auto shadow-md bg-[#102F24] hover:bg-[#183D2B] text-white rounded-xl px-7 py-3.5 font-bold border border-[#27403C] hover:scale-[1.02] active:scale-[0.98] transition-all font-mono text-xs uppercase tracking-wider hover-sheen"
                >
                  Explore the Platform
                </Button>
              </Link>
              <a
                href="#how-it-works"
                onClick={handleScrollToHowItWorks}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="lg"
                  icon={ArrowRight}
                  className="w-full sm:w-auto bg-white/95 hover:bg-white text-[#102F24] border border-[#183D2B]/30 rounded-xl px-6 py-3.5 font-bold shadow-xs hover:border-[#183D2B] transition-all font-mono text-xs uppercase tracking-wider cursor-pointer"
                >
                  Discover How It Works
                </Button>
              </a>
              <Link
                to="/report"
                className="text-xs sm:text-sm font-bold text-[#102F24] hover:text-[#183D2B] py-2 px-3 inline-flex items-center gap-1 group font-mono"
              >
                Report Litter →
              </Link>
            </div>

            {/* Trust Indicator Pill */}
            <div className="pt-5 border-t border-[#183D2B]/15 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#17251E] font-medium">
              <div className="inline-flex items-center gap-2 font-mono font-bold text-[11px] tracking-wider text-[#102F24]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E99A43]" />
                CITIZENS
                <span className="text-[#A9C7AE]">•</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#183D2B]" />
                AI INTELLIGENCE
                <span className="text-[#A9C7AE]">•</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#102F24]" />
                MUNICIPAL ACTION
              </div>
              <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#17251E]/80 font-sans">
                <CheckCircle2 className="w-4 h-4 text-[#183D2B]" />
                <span>Maharashtra Urban Operations Grid</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sophisticated Floating Environmental Intelligence Visualization */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Layered Decorative Backdrop Pill */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#183D2B]/20 to-[#A9C7AE]/30 rounded-3xl blur-lg opacity-70 -z-10" />

              <div className="relative bg-[#FFFDF9]/95 rounded-3xl border border-[#183D2B]/20 shadow-soft-xl overflow-hidden backdrop-blur-md card-lift">
                {/* HUD Header Bar: Deep Forest Green #102F24 */}
                <div className="px-5 py-3.5 bg-[#102F24] text-white flex items-center justify-between text-xs border-b border-[#27403C]">
                  <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-[#A9C7AE] animate-pulse" />
                    <span className="font-bold tracking-wide uppercase font-mono text-[11px] text-white">
                      Live Municipal Telemetry
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#A9C7AE] font-bold bg-[#183D2B] px-2.5 py-0.5 rounded-full border border-[#27403C]">
                    GRID: MH-PUNE-18.52N
                  </span>
                </div>

                {/* Segmented Telemetry Tabs */}
                <div className="grid grid-cols-3 bg-[#EFE9DD]/80 p-1 border-b border-[#183D2B]/10 text-xs font-bold">
                  <button
                    onClick={() => setActiveTelemetryTab('hotspot')}
                    className={`py-1.5 px-2 rounded-xl text-[11px] transition-all font-mono cursor-pointer ${
                      activeTelemetryTab === 'hotspot'
                        ? 'bg-[#102F24] text-[#A9C7AE] shadow-xs font-bold'
                        : 'text-[#17251E]/70 hover:text-[#102F24]'
                    }`}
                  >
                    Hotspot Radar
                  </button>
                  <button
                    onClick={() => setActiveTelemetryTab('vision')}
                    className={`py-1.5 px-2 rounded-xl text-[11px] transition-all font-mono cursor-pointer ${
                      activeTelemetryTab === 'vision'
                        ? 'bg-[#102F24] text-[#A9C7AE] shadow-xs font-bold'
                        : 'text-[#17251E]/70 hover:text-[#102F24]'
                    }`}
                  >
                    AI Vision
                  </button>
                  <button
                    onClick={() => setActiveTelemetryTab('dispatch')}
                    className={`py-1.5 px-2 rounded-xl text-[11px] transition-all font-mono cursor-pointer ${
                      activeTelemetryTab === 'dispatch'
                        ? 'bg-[#102F24] text-[#A9C7AE] shadow-xs font-bold'
                        : 'text-[#17251E]/70 hover:text-[#102F24]'
                    }`}
                  >
                    Squad Dispatch
                  </button>
                </div>

                {/* Tab Content Display */}
                <div className="p-5 space-y-4">
                  {activeTelemetryTab === 'hotspot' && (
                    <div className="space-y-3 animate-fadeIn">
                      {/* Priority Hotspot 1 */}
                      <div className="p-3.5 rounded-2xl bg-rose-50/90 border border-rose-200/90 flex items-start gap-3 shadow-xs">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <Flame className="w-5 h-5 text-rose-100" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-bold text-rose-950 truncate">
                              Mutha Riverbed Drainage Corridor
                            </h4>
                            <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-rose-200 text-rose-900 shrink-0">
                              SCORE 96
                            </span>
                          </div>
                          <p className="text-[11px] text-rose-800 mt-0.5 leading-snug font-medium">
                            38 recurring dumps. High plastic runoff risk to river buffer.
                          </p>
                        </div>
                      </div>

                      {/* Priority Hotspot 2 */}
                      <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-3 shadow-xs">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <MapPin className="w-5 h-5 text-amber-100" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-bold text-amber-950 truncate">
                              FC Road Commercial Corridor
                            </h4>
                            <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 shrink-0">
                              SCORE 89
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-800 mt-0.5 leading-snug font-medium">
                            26 reports logged. Overflowing bins along pedestrian promenade.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTelemetryTab === 'vision' && (
                    <div className="space-y-3 animate-fadeIn text-xs">
                      <div className="p-3.5 rounded-2xl bg-[#EFE9DD]/90 border border-[#183D2B]/15 space-y-2">
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span className="font-bold text-[#102F24] flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5 text-[#183D2B]" />
                            YOLOv8 Inference Pipeline (Staged)
                          </span>
                          <span className="text-[#183D2B] font-bold">98.4% Conf</span>
                        </div>
                        <div className="space-y-1.5 text-[11px] text-[#17251E]">
                          <div className="flex justify-between font-medium">
                            <span>PET Beverage Plastics:</span>
                            <span className="font-bold font-mono text-[#102F24]">14 Items (82%)</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Aluminum Scrap & Cans:</span>
                            <span className="font-bold font-mono text-[#102F24]">6 Items (18%)</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#A9C7AE]/30 rounded-full overflow-hidden">
                            <div className="h-full bg-[#183D2B] rounded-full w-[82%]" />
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#17251E]/70 leading-snug font-medium">
                        Autonomous material classification triggers in Phase 2 upon photographic upload.
                      </p>
                    </div>
                  )}

                  {activeTelemetryTab === 'dispatch' && (
                    <div className="space-y-3 animate-fadeIn text-xs">
                      <div className="p-3.5 rounded-2xl bg-blue-50/90 border border-blue-200/90 space-y-2">
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span className="font-bold text-blue-950 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-blue-600" />
                            PMC Ward 12 Rapid Sanitation Squad
                          </span>
                          <span className="text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded-full text-[10px]">
                            In Transit
                          </span>
                        </div>
                        <p className="text-[11px] text-blue-800 font-medium">
                          Destination: Sambhaji Park Perimeter • ETA: 18 mins • Work Order #PMC-803
                        </p>
                      </div>
                      <p className="text-[11px] text-[#17251E]/70 leading-snug font-medium">
                        Automated work orders dispatched with verified GPS navigation coordinates.
                      </p>
                    </div>
                  )}

                  {/* Bottom Metric Capsule: District Efficiency */}
                  <div className="p-3.5 rounded-2xl bg-[#F0F8F5] border border-[#A9C7AE]/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#183D2B] font-bold block uppercase tracking-wider font-mono">
                        District Response Efficiency
                      </span>
                      <p className="text-xl font-bold text-[#102F24] font-mono leading-tight">
                        94.2% within 24h
                      </p>
                    </div>
                    <Link to="/app">
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-[#102F24] text-white hover:bg-[#183D2B] text-xs font-bold inline-flex items-center gap-1 shadow-xs transition-colors font-mono cursor-pointer"
                      >
                        Enter App →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
