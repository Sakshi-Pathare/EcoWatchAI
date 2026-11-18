import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { createSeverityIcon } from './mapIcons';
import { getSeverityBadgeProps, getStatusBadgeProps, getCategoryLabel } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';
import { MapPin, Calendar, Scale, ExternalLink, Layers, Eye, Compass, Flame, ShieldAlert } from 'lucide-react';
import { Button } from '../common/Button';

// Map Controller for programmatically resetting view
function MapViewResetter({ center, zoom }) {
  const map = useMap();
  return null;
}

export function InteractiveMap({
  reports = [],
  hotspots = [],
  center = [37.7749, -122.4194],
  zoom = 13,
  height = '620px',
  showHotspotOverlays = true,
  onSelectReport,
}) {
  const [mapStyle, setMapStyle] = useState('osm'); // 'osm' | 'light' | 'satellite'

  const tileLayers = {
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    },
    light: {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CartoDB & OpenStreetMap',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri & Earthstar Geographics',
    },
  };

  const highSeverityCount = reports.filter(r => r.severity === 'high' || r.severity === 'critical').length;
  const totalKg = reports.reduce((acc, r) => acc + (r.estimatedKg || 0), 0);

  return (
    <div
      style={{ height }}
      className="w-full rounded-3xl overflow-hidden border border-sage-300 shadow-soft-lg relative z-0 group"
    >
      {/* Floating Map HUD Top Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left Telemetry Capsule */}
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-sage-200/90 shadow-soft flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-forest-900 font-bold">
            <span className="w-2 h-2 rounded-full bg-limeaccent-500 animate-pulse" />
            <span>{reports.length} Incidents</span>
          </div>
          {highSeverityCount > 0 && (
            <div className="flex items-center gap-1.5 text-rose-700 font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>{highSeverityCount} Critical</span>
            </div>
          )}
          <div className="hidden sm:flex items-center gap-1 text-charcoal-500">
            <Scale className="w-3.5 h-3.5 text-forest-700" />
            <span>~{totalKg.toFixed(0)} kg Est. Litter</span>
          </div>
        </div>

        {/* Right Map Layer Mode Switcher */}
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md p-1 rounded-2xl border border-sage-200/90 shadow-soft flex items-center gap-1 text-xs">
          <button
            onClick={() => setMapStyle('osm')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
              mapStyle === 'osm'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'text-charcoal-600 hover:text-forest-900 hover:bg-sage-100'
            }`}
          >
            GIS Standard
          </button>
          <button
            onClick={() => setMapStyle('light')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
              mapStyle === 'light'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'text-charcoal-600 hover:text-forest-900 hover:bg-sage-100'
            }`}
          >
            Clean Canvas
          </button>
          <button
            onClick={() => setMapStyle('satellite')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
              mapStyle === 'satellite'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'text-charcoal-600 hover:text-forest-900 hover:bg-sage-100'
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          key={mapStyle}
          attribution={tileLayers[mapStyle].attribution}
          url={tileLayers[mapStyle].url}
        />

        {/* Hotspot density buffer zones */}
        {showHotspotOverlays &&
          hotspots.map((hotspot) => {
            const isHigh = hotspot.severity === 'high';
            return (
              <Circle
                key={hotspot.id}
                center={[hotspot.latitude, hotspot.longitude]}
                radius={hotspot.radiusMeters || 220}
                pathOptions={{
                  color: isHigh ? '#E11D48' : '#D97706',
                  fillColor: isHigh ? '#E11D48' : '#D97706',
                  fillOpacity: isHigh ? 0.22 : 0.16,
                  weight: 2,
                  dashArray: '5, 8',
                }}
              >
                <Popup>
                  <div className="p-4 max-w-xs text-xs space-y-2 font-sans">
                    <div className="flex items-center justify-between border-b border-sage-100 pb-2">
                      <div className="flex items-center gap-1.5 text-rose-800 font-bold">
                        <Flame className="w-4 h-4 text-rose-600" />
                        <span className="text-sm font-extrabold text-charcoal-900">{hotspot.name}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-black text-[11px] font-mono">
                        {hotspot.priorityScore}/100
                      </span>
                    </div>

                    <p className="text-charcoal-600 leading-snug">{hotspot.district}</p>

                    <div className="p-2.5 rounded-xl bg-forest-50/80 border border-forest-100 space-y-1 text-[11px]">
                      <span className="font-bold text-forest-900 block">Intervention Required:</span>
                      <p className="text-forest-800">{hotspot.suggestedAction}</p>
                    </div>

                    <div className="pt-2 border-t border-sage-100 flex items-center justify-between text-[11px] text-charcoal-500 font-mono">
                      <span>{hotspot.recurrenceCount} Incidents Logged</span>
                      <span className="font-bold text-rose-700">{hotspot.trend}</span>
                    </div>
                  </div>
                </Popup>
              </Circle>
            );
          })}

        {/* Report Markers */}
        {reports.map((report) => {
          const sevProps = getSeverityBadgeProps(report.severity);
          const statProps = getStatusBadgeProps(report.status);
          const icon = createSeverityIcon(report.severity);

          return (
            <Marker
              key={report.id}
              position={[report.latitude, report.longitude]}
              icon={icon}
            >
              <Popup className="custom-report-popup">
                <div className="w-72 overflow-hidden rounded-2xl text-left font-sans">
                  {report.imageUrl && (
                    <div className="h-36 w-full overflow-hidden relative bg-sage-100">
                      <img
                        src={report.imageUrl}
                        alt={report.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <span
                        className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border shadow-xs ${sevProps.bg}`}
                      >
                        {sevProps.label}
                      </span>
                    </div>
                  )}

                  <div className="p-4 space-y-2.5">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-charcoal-400 mb-0.5">
                        <span>{report.id}</span>
                        <span>{formatDate(report.reportedAt)}</span>
                      </div>
                      <h4 className="font-bold text-sm text-charcoal-900 line-clamp-1">
                        {report.title}
                      </h4>
                    </div>

                    <div className="space-y-1.5 text-xs text-charcoal-600">
                      <div className="flex items-center gap-1.5 text-charcoal-500">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-forest-700" />
                        <span className="truncate">{report.address}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-bold text-forest-900 text-[11px] bg-forest-50 px-2 py-0.5 rounded border border-forest-100">
                          {getCategoryLabel(report.category)}
                        </span>
                        <span className="flex items-center gap-1 text-charcoal-600 font-mono font-semibold">
                          <Scale className="w-3.5 h-3.5 text-forest-600" />
                          ~{report.estimatedKg} kg
                        </span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-sage-100 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full border font-semibold ${statProps.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statProps.dot}`} />
                        {statProps.label}
                      </span>

                      {onSelectReport && (
                        <button
                          onClick={() => onSelectReport(report)}
                          className="text-xs text-forest-800 hover:text-forest-950 font-bold inline-flex items-center gap-1 bg-sage-100 hover:bg-sage-200 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          Details <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
