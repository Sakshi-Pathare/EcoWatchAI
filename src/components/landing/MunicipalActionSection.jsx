import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  Users,
  Camera,
  FileCheck,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { Button } from '../common/Button';
import { cleanupService } from '../../services/cleanupService';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function MunicipalActionSection() {
  const [cleanups, setCleanups] = useState([]);
  const [selectedCleanup, setSelectedCleanup] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerRef, isRevealed] = useScrollReveal({ threshold: 0.1 });
  const sliderBoxRef = useRef(null);

  useEffect(() => {
    async function loadCleanups() {
      try {
        const data = await cleanupService.getCleanups();
        setCleanups(data || []);
        // Pick the completed task with before/after images (Sarasbaug Park CLN-803)
        const completed = data.find((c) => c.status === 'completed' && c.afterImageUrl) || data[0];
        setSelectedCleanup(completed);
      } catch (e) {
        console.error('Failed to load cleanup operations', e);
      }
    }
    loadCleanups();
  }, []);

  const handleSliderMove = (clientX) => {
    if (!sliderBoxRef.current) return;
    const rect = sliderBoxRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pos);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    handleSliderMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleSliderMove(e.clientX);
  };

  const municipalWorkflow = [
    {
      title: 'Review Citizen Reports',
      desc: 'Inspect geotagged photographic reports with validated timestamps and ward attribution.',
    },
    {
      title: 'Monitor Hotspot Locations',
      desc: 'Identify clusters where waste volume or ecological vulnerability is escalating.',
    },
    {
      title: 'Assign Cleanup Operations',
      desc: 'Deploy designated municipal squads with estimated tonnage and equipment requirements.',
    },
    {
      title: 'Track Real-Time Progress',
      desc: 'Supervise task dispatch, in-transit ETA, and field supervisor status milestones.',
    },
    {
      title: 'Verify Completion with Photographic Audit',
      desc: 'Mandate geocoded after-photographs to officially close tasks and notify reporting citizens.',
    },
  ];

  return (
    <section
      id="municipal-action"
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
            Municipal Action
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#102F24] tracking-tight leading-tight">
            Turning environmental insights <br />
            <span className="text-[#183D2B] font-serif italic">into measurable action.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#17251E]/80 font-sans leading-relaxed">
            Data is meaningless without deployment. Vasundhara AI equips municipal corporations with audited,
            closed-loop workflows that ensure every reported incident is resolved and verified.
          </p>
        </div>

        {/* Split Screen Section: Workflow Guide (Left) vs Interactive Cleanup Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Municipal Workflow Steps */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3.5">
              {municipalWorkflow.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-[#183D2B]/10 hover:border-[#183D2B]/30 shadow-soft-xs card-lift transition-all flex items-start gap-3.5 group cursor-default"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#EFE9DD] text-[#102F24] font-mono font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-[#102F24] group-hover:text-white transition-colors">
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#102F24] mb-0.5">{item.title}</h4>
                    <p className="text-xs text-[#17251E]/75 leading-relaxed font-sans">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link to="/cleanups">
                <Button
                  variant="primary"
                  size="md"
                  icon={CheckSquare}
                  className="bg-[#102F24] hover:bg-[#183D2B] text-white rounded-xl px-5 py-3 font-bold font-mono text-xs uppercase tracking-wider hover-sheen"
                >
                  Explore Municipal Cleanup Operations →
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Before/After Comparison Slider */}
          <div className="lg:col-span-7">
            {selectedCleanup && (
              <div className="rounded-3xl bg-white border border-[#183D2B]/15 shadow-soft-lg overflow-hidden card-lift">
                {/* Header Strip */}
                <div className="px-6 py-4 bg-[#102F24] text-white flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#A9C7AE]" />
                    <span className="font-bold text-[#A9C7AE] uppercase">
                      Audited Cleanup Order • {selectedCleanup.id}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 font-bold border border-emerald-600 text-[10px]">
                    STATUS: RESOLVED & VERIFIED
                  </span>
                </div>

                {/* Photographic Comparison Box */}
                <div className="p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-[#102F24]">
                        {selectedCleanup.taskName}
                      </h4>
                      <p className="text-xs text-[#17251E]/70 font-mono mt-0.5">
                        {selectedCleanup.location}
                      </p>
                    </div>

                    <div className="text-[11px] font-mono text-[#183D2B] bg-[#EFE9DD] px-3 py-1 rounded-xl shrink-0">
                      Drag divider to compare
                    </div>
                  </div>

                  {/* Interactive Split-Screen Slider Window */}
                  <div
                    ref={sliderBoxRef}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                    onMouseMove={handleMouseMove}
                    onTouchStart={() => setIsDragging(true)}
                    onTouchEnd={() => setIsDragging(false)}
                    onTouchMove={handleTouchMove}
                    className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-900 border border-[#183D2B]/15 select-none cursor-ew-resize group shadow-inner"
                  >
                    {/* Underlying After Photo (Cleaned Site) */}
                    <img
                      src={selectedCleanup.afterImageUrl || selectedCleanup.beforeImageUrl}
                      alt="Remediated Site"
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />

                    {/* Top Before Photo (Clipped to Slider Position) */}
                    <div
                      className="absolute inset-0 overflow-hidden pointer-events-none"
                      style={{ width: `${sliderPosition}%` }}
                    >
                      <img
                        src={selectedCleanup.beforeImageUrl}
                        alt="Initial Waste Dump Site"
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        style={{
                          width: sliderBoxRef.current
                            ? `${sliderBoxRef.current.clientWidth}px`
                            : '100%',
                          maxWidth: 'none',
                        }}
                      />
                    </div>

                    {/* Draggable Vertical Divider Line */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)] cursor-ew-resize z-20 flex items-center justify-center pointer-events-none"
                      style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#102F24] border-2 border-white text-[#A9C7AE] flex items-center justify-center shadow-lg font-mono text-[10px] font-bold">
                        ⟷
                      </div>
                    </div>

                    {/* Left Tag: Initial Waste */}
                    <div className="absolute top-3 left-3 bg-[#102F24]/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono text-[10px] border border-white/20 z-10">
                      BEFORE: CITIZEN REPORT
                    </div>

                    {/* Right Tag: Verified Remediated */}
                    <div className="absolute top-3 right-3 bg-emerald-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-emerald-300 font-mono text-[10px] border border-emerald-500/30 z-10">
                      AFTER: VERIFIED REMEDIATION
                    </div>
                  </div>

                  {/* Task Meta Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono p-3.5 rounded-2xl bg-[#F8F6F0] border border-[#183D2B]/10">
                    <div>
                      <span className="text-[10px] text-[#17251E]/60 block uppercase">Assigned Unit</span>
                      <span className="font-bold text-[#102F24] truncate block">
                        {selectedCleanup.assignedTeam || 'PMC Rapid Squad'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#17251E]/60 block uppercase">Lead Inspector</span>
                      <span className="font-bold text-[#102F24] truncate block">
                        {selectedCleanup.contactLead || 'Suresh Gaikwad'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#17251E]/60 block uppercase">Waste Diverted</span>
                      <span className="font-bold text-[#183D2B] block">
                        {selectedCleanup.wasteVolumeEstimate || '15 kg'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#17251E]/60 block uppercase">Verification</span>
                      <span className="font-bold text-emerald-700 block">
                        ✓ Ward Sign-off
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
