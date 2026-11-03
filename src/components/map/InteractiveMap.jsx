import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { createSeverityIcon } from './mapIcons';
import { getSeverityBadgeProps, getStatusBadgeProps, getCategoryLabel } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';
import { MapPin, Calendar, Scale, ExternalLink } from 'lucide-react';
import { Button } from '../common/Button';

export function InteractiveMap({
  reports = [],
  hotspots = [],
  center = [37.7749, -122.4194],
  zoom = 13,
  height = '600px',
  showHotspotOverlays = true,
  onSelectReport,
}) {
  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-sage-200 shadow-soft relative z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Hotspot density buffer zones */}
        {showHotspotOverlays &&
          hotspots.map((hotspot) => {
            const isHigh = hotspot.severity === 'high';
            return (
              <Circle
                key={hotspot.id}
                center={[hotspot.latitude, hotspot.longitude]}
                radius={hotspot.radiusMeters || 200}
                pathOptions={{
                  color: isHigh ? '#E11D48' : '#D97706',
                  fillColor: isHigh ? '#E11D48' : '#D97706',
                  fillOpacity: 0.15,
                  weight: 1.5,
                  dashArray: '4, 6',
                }}
              >
                <Popup>
                  <div className="p-3 max-w-xs text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-forest-900 text-sm">{hotspot.name}</span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold text-[10px]">
                        Priority {hotspot.priorityScore}/100
                      </span>
                    </div>
                    <p className="text-charcoal-600">{hotspot.district}</p>
                    <div className="pt-2 border-t border-sage-100 flex items-center justify-between text-[11px] text-charcoal-500">
                      <span>{hotspot.recurrenceCount} reports logged</span>
                      <span>{hotspot.trend}</span>
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
                <div className="w-64 overflow-hidden rounded-xl text-left">
                  {report.imageUrl && (
                    <div className="h-32 w-full overflow-hidden relative bg-sage-100">
                      <img
                        src={report.imageUrl}
                        alt={report.title}
                        className="w-full h-full object-cover"
                      />
                      <span
                        className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${sevProps.bg}`}
                      >
                        {sevProps.label}
                      </span>
                    </div>
                  )}

                  <div className="p-3.5 space-y-2">
                    <div>
                      <span className="text-[10px] font-mono font-medium text-charcoal-400">
                        {report.id}
                      </span>
                      <h4 className="font-semibold text-xs text-charcoal-900 line-clamp-1">
                        {report.title}
                      </h4>
                    </div>

                    <div className="space-y-1 text-[11px] text-charcoal-600">
                      <div className="flex items-center gap-1.5 text-charcoal-500">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-forest-700" />
                        <span className="truncate">{report.address}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-medium text-forest-800">
                          {getCategoryLabel(report.category)}
                        </span>
                        <span className="flex items-center gap-1 text-charcoal-500">
                          <Scale className="w-3 h-3" />
                          ~{report.estimatedKg} kg
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-sage-100 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${statProps.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statProps.dot}`} />
                        {statProps.label}
                      </span>

                      {onSelectReport && (
                        <button
                          onClick={() => onSelectReport(report)}
                          className="text-xs text-forest-700 hover:text-forest-900 font-medium inline-flex items-center gap-0.5"
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

