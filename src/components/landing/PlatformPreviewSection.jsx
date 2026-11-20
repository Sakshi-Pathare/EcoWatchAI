import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Camera,
  MapPin,
  Flame,
  ShieldCheck,
  CheckSquare,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Maximize2,
} from 'lucide-react';
import { Button } from '../common/Button';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function PlatformPreviewSection() {
  const [activePreviewTab, setActivePreviewTab] = useState('dashboard');
  const [containerRef, isRevealed] = useScrollReveal({ threshold: 0.1 });

  const previews = [
    {
      id: 'dashboard',
      name: 'Citizen Dashboard',
      category: 'Volunteer Impact',
      icon: LayoutDashboard,
      headline: 'Real-time personal stewardship tracking & community karma.',
      description:
        'Citizens track their submitted reports, monitor resolution velocity, and observe ecological points in real time. Nearby hotspot alerts warn volunteers when local riverbanks or pedestrian zones need additional reporting eyes.',
      path: '/dashboard',
      badge: 'Steward Portal',
      mockupData: {
        title: 'Alex Morgan • ECO SENTINEL',
        subtitle: 'Pune Municipal Corporation Grid • Top 8% of civic contributors',
        stats: [
          { label: 'Eco Points', val: '1,420' },
          { label: 'Reports Filed', val: '18' },
          { label: 'Verified Cleaned', val: '15' },
          { label: 'District Rank', val: '#14' },
        ],
        alertTitle: 'Nearby Priority Hotspot Alert',
        alertBody: 'Mutha Riverbed Drainage Corridor is registering elevated plastic accumulation. Extra volunteer reporting is requested.',
      },
    },
    {
      id: 'report',
      name: 'Incident Reporting',
      category: 'Field Capture',
      icon: Camera,
      headline: 'Under 30-second mobile photographic reporting wizard.',
      description:
        'Citizens capture photos with automatic EXIF geotagging, select litter category (plastic, glass, mixed, hazardous), specify severity rating, and drop an interactive pin on OpenStreetMap.',
      path: '/report',
      badge: 'Capture Wizard',
      mockupData: {
        title: 'Litter Incident Submission Form',
        subtitle: 'Near FC Road, Deccan Gymkhana, Pune, Maharashtra 411004',
        stats: [
          { label: 'Category', val: 'Plastic Refuse' },
          { label: 'Severity', val: 'High Impact' },
          { label: 'GPS Accuracy', val: '± 3.2 meters' },
          { label: 'Est. Weight', val: '15 kg' },
        ],
        alertTitle: 'EXIF Metadata Verified',
        alertBody: 'Coordinates locked at 18.5222° N, 73.8415° E. Nearest ward auto-assigned to PMC Ward 12 Sanitation Division.',
      },
    },
    {
      id: 'map',
      name: 'Pollution GIS Map',
      category: 'Geospatial Cartography',
      icon: MapPin,
      headline: 'Interactive Leaflet cartography with recurrence overlays.',
      description:
        'Explore live spatial distribution of litter incidents across Maharashtra cities. Filter by severity, resolution status, or waste category with real-time city presets for Pune, Mumbai, Nagpur, and Nashik.',
      path: '/map',
      badge: 'Vector GIS Engine',
      mockupData: {
        title: 'Maharashtra Metropolitan Pollution Cartography',
        subtitle: 'Pune City Center • 469 Incidents Monitored',
        stats: [
          { label: 'Active Reports', val: '469' },
          { label: 'Hotspot Overlays', val: 'Enabled' },
          { label: 'Tile Server', val: 'OpenStreetMap' },
          { label: 'Resolution Rate', val: '94.2%' },
        ],
        alertTitle: 'Active City Preset: Pune Central',
        alertBody: 'Displaying high-density clusters across Mutha Riverbed, FC Road Deccan, and Sarasbaug Park zones.',
      },
    },
    {
      id: 'hotspots',
      name: 'Hotspot Intelligence',
      category: 'Algorithmic Diagnostics',
      icon: Flame,
      headline: 'Spatial density clustering identifying chronic dump corridors.',
      description:
        'Automated recurrence clustering calculates priority scores (0-100) based on dump frequency, proximity to primary river basins, and school buffers. Ranks locations needing structural municipal remediation.',
      path: '/hotspots',
      badge: 'Cluster Intelligence',
      mockupData: {
        title: 'Hotspot Density & Recurrence Analytics',
        subtitle: 'DBSCAN Adaptive Radius Engine • 6 Active Clusters Mapped',
        stats: [
          { label: 'Top Hotspot', val: 'Mutha Riverbed' },
          { label: 'Priority Score', val: '96 / 100' },
          { label: 'Recurrence Count', val: '38 Dumps' },
          { label: 'Trend', val: '+24% this month' },
        ],
        alertTitle: 'Ecological Vulnerability Alert',
        alertBody: 'Severe single-use plastic runoff directly entering riverine basin. Floating trash interceptor booms recommended.',
      },
    },
    {
      id: 'admin',
      name: 'Municipal Command Center',
      category: 'Executive Operations',
      icon: ShieldCheck,
      headline: 'Executive command console for municipal authorities.',
      description:
        'Sanitation inspectors track SLA compliance, monitor contractor resolution times, review zonal performance rankings, and analyze macro monthly environmental trend lines.',
      path: '/admin',
      badge: 'Command Console',
      mockupData: {
        title: 'Pune Municipal Corporation Sanitation Command',
        subtitle: 'Ward Performance & SLA Monitoring • Central Division',
        stats: [
          { label: 'Avg Turnaround', val: '19.4 Hours' },
          { label: 'SLA Compliance', val: '94.2%' },
          { label: 'Tonnage Cleared', val: '4,280 kg' },
          { label: 'Active Squads', val: '12 Deployed' },
        ],
        alertTitle: 'District SLA Status: OPTIMAL',
        alertBody: '83.3% of logged incidents resolved within 24 hours. Ward 12 exhibiting fastest average response time (14.2h).',
      },
    },
    {
      id: 'cleanups',
      name: 'Cleanup Management',
      category: 'Field Dispatch',
      icon: CheckSquare,
      headline: 'Zonal sanitation squad work orders & before/after audits.',
      description:
        'Assign cleanup tasks directly to municipal crews, track field status (in progress, in transit), and mandate geocoded after-photographs to officially close the ticket and verify cleanliness.',
      path: '/cleanups',
      badge: 'Audited Dispatch',
      mockupData: {
        title: 'Municipal Task Order #CLN-801',
        subtitle: 'FC Road Pedestrian Promenade • PMC Ward 12 Rapid Squad',
        stats: [
          { label: 'Crew Lead', val: 'Suresh Gaikwad' },
          { label: 'Task Status', val: 'In Progress' },
          { label: 'Est. Volume', val: '15 kg' },
          { label: 'Audit Sign-off', val: 'Required' },
        ],
        alertTitle: 'Zonal Sanitation Crew In Transit',
        alertBody: 'Heavy-duty segregation bags deployed for commercial food street evening sweep. GPS navigation locked.',
      },
    },
  ];

  const currentPreview = previews.find((p) => p.id === activePreviewTab) || previews[0];

  return (
    <section
      id="preview"
      ref={containerRef}
      className={`py-20 sm:py-32 bg-[#F8F6F0] border-b border-[#183D2B]/10 transition-all duration-700 ${
        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183D2B]/10 border border-[#183D2B]/20 text-[#102F24] font-mono text-[11px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#183D2B]" />
            Application Interface Preview
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#102F24] tracking-tight leading-tight">
            Designed for clarity, speed, <br />
            <span className="text-[#183D2B] font-serif italic">and sovereign municipal precision.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#17251E]/80 font-sans leading-relaxed">
            Inspect authentic demonstrations of our six core application modules.
            Every screen is engineered for high information density and intuitive operation in the field.
          </p>
        </div>

        {/* Module Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {previews.map((prev) => {
            const Icon = prev.icon;
            const isActive = activePreviewTab === prev.id;
            return (
              <button
                key={prev.id}
                onClick={() => setActivePreviewTab(prev.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#102F24] text-[#A9C7AE] shadow-md border border-[#183D2B]'
                    : 'bg-white text-[#102F24] border border-[#183D2B]/15 hover:border-[#183D2B]/40 hover:bg-[#FAF8F5]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#A9C7AE]' : 'text-[#183D2B]'}`} />
                <span className="font-sans">{prev.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9C7AE] shadow-[0_0_6px_#A9C7AE]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Live Interactive Application Mockup Card */}
        <div className="rounded-3xl bg-white border border-[#183D2B]/15 shadow-soft-lg overflow-hidden">
          {/* Mockup Window Chrome Header */}
          <div className="px-6 py-4 bg-[#102F24] text-white flex items-center justify-between border-b border-[#27403C]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-[#A9C7AE] font-bold hidden sm:inline">
                https://vasundhara-ai.in{currentPreview.path}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono uppercase bg-[#183D2B] text-[#A9C7AE] px-2.5 py-0.5 rounded-full border border-[#27403C]">
                {currentPreview.badge}
              </span>
              <Link to={currentPreview.path}>
                <span className="text-xs font-mono font-bold text-white hover:text-[#A9C7AE] inline-flex items-center gap-1 transition-colors">
                  Open Live Route <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>

          {/* Mockup Canvas Body */}
          <div className="p-6 sm:p-10 space-y-8 bg-[#FAF8F3]">
            {/* Mock Header Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#183D2B]/10">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#183D2B] block mb-1">
                  MODULE PREVIEW • {currentPreview.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#102F24]">
                  {currentPreview.mockupData.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#17251E]/75 font-mono mt-1">
                  {currentPreview.mockupData.subtitle}
                </p>
              </div>

              <Link to={currentPreview.path}>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-[#102F24] hover:bg-[#183D2B] text-white rounded-xl px-5 py-2.5 text-xs font-mono font-bold shrink-0"
                >
                  Launch This Module →
                </Button>
              </Link>
            </div>

            {/* Mock Stats Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {currentPreview.mockupData.stats.map((st, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white border border-[#183D2B]/10 shadow-soft-xs space-y-1"
                >
                  <span className="text-[10px] font-mono uppercase text-[#17251E]/60 block font-bold">
                    {st.label}
                  </span>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#102F24]">
                    {st.val}
                  </div>
                </div>
              ))}
            </div>

            {/* Mock Operational Alert Box */}
            <div className="p-5 rounded-2xl bg-white border border-[#183D2B]/15 shadow-soft-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#102F24]">
                <Sparkles className="w-4 h-4 text-[#E99A43]" />
                {currentPreview.mockupData.alertTitle}
              </div>
              <p className="text-xs text-[#17251E]/80 font-sans leading-relaxed">
                {currentPreview.mockupData.alertBody}
              </p>
            </div>

            {/* Explanation & Master CTA */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#183D2B]/10">
              <p className="text-xs text-[#17251E]/80 max-w-xl leading-relaxed">
                {currentPreview.description}
              </p>

              <Link to="/app">
                <Button
                  variant="pista"
                  size="md"
                  className="font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-md"
                >
                  Explore the Full Platform →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
