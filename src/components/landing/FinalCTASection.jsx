import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Compass, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export function FinalCTASection() {
  return (
    <section className="relative py-24 sm:py-32 bg-[#FAF8F3] text-[#17251E] overflow-hidden border-t border-[#E4D2BF]">
      {/* Subtle Indian Tricolor Hairline Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E99A43] via-white to-[#183D2B] opacity-80" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF5EF] border border-[#E4D2BF] text-[#183D2B] font-mono text-xs font-bold uppercase tracking-widest shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#E99A43]" />
          Civic Environmental Stewardship
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#102F24] tracking-tight leading-tight">
          Be part of a cleaner, <br />
          <span className="text-[#183D2B] font-serif italic">smarter tomorrow.</span>
        </h2>

        <p className="text-base sm:text-lg text-[#17251E]/80 max-w-2xl mx-auto font-sans leading-relaxed">
          Turn environmental awareness into meaningful civic action with Vasundhara AI.
          Join thousands of citizens, municipal officers, and sanitation squads across Maharashtra building cleaner cities.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/app">
            <Button
              variant="primary"
              size="lg"
              icon={Compass}
              className="w-full sm:w-auto bg-[#102F24] hover:bg-[#183D2B] text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all uppercase tracking-wider font-mono hover-sheen"
            >
              Launch Vasundhara AI
            </Button>
          </Link>
          <Link to="/report">
            <Button
              variant="outline"
              size="lg"
              icon={Camera}
              className="w-full sm:w-auto border-[#E4D2BF] text-[#102F24] bg-white hover:bg-[#FAF5EF] rounded-xl px-7 py-4 font-bold text-sm shadow-xs font-mono"
            >
              Report an Environmental Issue
            </Button>
          </Link>
        </div>

        <div className="pt-10 border-t border-[#E4D2BF] flex flex-wrap items-center justify-center gap-6 text-xs text-[#183D2B] font-mono font-bold">
          <span>✓ OPENSTREETMAP GIS</span>
          <span>•</span>
          <span>✓ NO VENDOR LOCK-IN</span>
          <span>•</span>
          <span>✓ FULL AUDIT TRAIL</span>
        </div>
      </div>
    </section>
  );
}
