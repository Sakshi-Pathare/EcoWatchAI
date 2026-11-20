import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Flame,
  Layers,
  ArrowRight,
  Radio,
} from 'lucide-react';
import { Button } from '../common/Button';
import { InteractiveMap } from '../map/InteractiveMap';
import { reportService } from '../../services/reportService';
import { hotspotService } from '../../services/hotspotService';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function GISIntelligenceSection() {
  const [reports, setReports] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [mapCenter, setMapCenter] = useState([18.5204, 73.8567]);
  const [mapZoom, setMapZoom] = useState(13);
  const [containerRef, isRevealed] = useScrollReveal({ threshold: 0.1 });

  useEffect(() => {
    async function loadData() {
      try {
        const [rep, hot] = await Promise.all([
          reportService.getAllReports(),
          hotspotService.getHotspots(),
        ]);
        setReports(rep || []);
        setHotspots(hot || []);
      } catch (err) {
        console.error('Failed to load map data on landing page', err);
      }
    }
    loadData();
  }, []);

  const handleFocusHotspot = (lat, lng, zoom = 15) => {
    setMapCenter([lat, lng]);
    setMapZoom(zoom);
  };

  return (
    <section
      id="gis-intel"
      ref={containerRef}
      className={`py-20 sm:py-32 bg-[#FAF8F3] text-[#17251E] border-b border-[#E4D2BF] relative overflow-hidden transition-all duration-700 ${
        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF5EF] border border-[#E4D2BF] text-[#183D2B] font-mono text-[11px] font-bold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#183D2B] animate-ping" />
              Geospatial Intelligence
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#102F24] tracking-tight leading-tight">
              See environmental problems <br />
              <span className="text-[#183D2B] font-serif italic">geographically.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#17251E]/80 font-sans leading-relaxed">
              Real-time municipal cartography powered by OpenStreetMap. Track crowdsourced incident clusters,
              ecological river runoff, and prioritized cleanup zones across Maharashtra.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/map">
              <Button
                variant="primary"
                size="md"
                icon={Compass}
                className="bg-[#102F24] hover:bg-[#183D2B] text-white font-bold text-xs uppercase tracking-wider rounded-xl px-5 py-3 shadow-md font-mono hover-sheen"
              >
                Explore Interactive GIS Map
              </Button>
            </Link>
          </div>
        </div>

        {/* GIS Console Grid: Map + Floating Intelligence Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Leaflet GIS Map Canvas */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-[#E4D2BF] shadow-soft-lg relative bg-white card-lift">
            {/* Map Top Bar */}
            <div className="px-5 py-3 bg-[#FAF5EF] border-b border-[#E4D2BF] flex items-center justify-between text-xs font-mono text-[#17251E]">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-[#183D2B] animate-pulse" />
                <span className="font-bold text-[11px] text-[#102F24] uppercase">
                  OpenStreetMap Spatial Engine • Pune & Mumbai Metro
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="hidden sm:inline text-[#17251E]/60">ZOOM: {mapZoom}x</span>
                <span className="text-[#183D2B] font-bold">STATUS: OPERATIONAL</span>
              </div>
            </div>

            {/* Embedded Interactive Map */}
            <div className="relative">
              <InteractiveMap
                reports={reports}
                hotspots={hotspots}
                center={mapCenter}
                zoom={mapZoom}
                height="560px"
                showHotspotOverlays={true}
                onSelectReport={setSelectedReport}
                autoLocate={false}
              />
            </div>
          </div>

          {/* Floating Intelligence Sidebar in Skin Beige / White */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            {/* Live Hotspots Quick-Focus List */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E4D2BF] shadow-soft-sm space-y-4 card-lift">
              <div className="flex items-center justify-between border-b border-[#E4D2BF] pb-3 text-xs">
                <span className="font-mono font-bold text-[#102F24] uppercase flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-600" />
                  Priority Hotspots
                </span>
                <span className="text-[10px] font-mono text-[#183D2B] font-bold bg-[#FAF5EF] px-2 py-0.5 rounded border border-[#E4D2BF]">
                  {hotspots.length} TRACKED
                </span>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {hotspots.slice(0, 4).map((h) => (
                  <div
                    key={h.id}
                    onClick={() => handleFocusHotspot(h.latitude, h.longitude, 16)}
                    className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E4D2BF] hover:border-[#183D2B]/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-[#102F24] group-hover:text-[#183D2B] transition-colors truncate">
                        {h.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 shrink-0">
                        SCORE {h.priorityScore}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#183D2B] font-mono truncate">
                      {h.district}
                    </div>
                    <div className="text-[10px] text-[#17251E]/60 mt-1.5 flex items-center justify-between font-mono">
                      <span>{h.recurrenceCount} recurrent dumps</span>
                      <span className="text-[#102F24] font-bold group-hover:underline">Click to Pan →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Report Or Metric Quick-Card */}
            <div className="p-5 rounded-3xl bg-white border border-[#E4D2BF] text-xs font-sans space-y-3 card-lift shadow-soft-xs">
              <div className="flex items-center gap-2 font-mono text-[#102F24] text-[11px] font-bold">
                <MapPin className="w-4 h-4 text-[#183D2B]" />
                {selectedReport ? 'Selected Incident Inspection' : 'Operational Summary'}
              </div>

              {selectedReport ? (
                <div className="space-y-1 text-[#17251E]">
                  <p className="font-bold text-sm text-[#102F24] truncate">{selectedReport.title || selectedReport.address}</p>
                  <p className="text-[11px] text-[#17251E]/80 font-mono">Location: {selectedReport.address}</p>
                  <p className="text-[11px] text-[#183D2B] font-mono font-bold">Category: {selectedReport.category} • Severity: {selectedReport.severity}</p>
                </div>
              ) : (
                <p className="text-[#17251E]/75 text-[11px] leading-relaxed">
                  Click any marker or hotspot circle on the map to inspect photographic evidence, severity rating,
                  and municipal dispatch work orders.
                </p>
              )}

              <div className="pt-2 border-t border-[#E4D2BF] flex items-center justify-between font-mono text-[10px] text-[#183D2B]">
                <span>COORDINATE ACCURACY: &lt;5M</span>
                <span className="font-bold">PUNE / MUMBAI GRID</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
