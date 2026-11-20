import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { createSeverityIcon, createUserLocationIcon } from './mapIcons';
import { getSeverityBadgeProps, getStatusBadgeProps, getCategoryLabel } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';
import {
  MapPin,
  Calendar,
  Scale,
  ExternalLink,
  Layers,
  Eye,
  Compass,
  Flame,
  ShieldAlert,
  Navigation,
  Crosshair,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../common/Button';

// Map Controller for programmatically flying/panning view
function MapPanController({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target && target.lat && target.lng) {
      map.flyTo([target.lat, target.lng], target.zoom || 15, {
        duration: 1.4,
        easeLinearity: 0.25,
      });
    }
  }, [target, map]);
  return null;
}

export function InteractiveMap({
  reports = [],
  hotspots = [],
  center = [18.5204, 73.8567],
  zoom = 13,
  height = '620px',
  showHotspotOverlays = true,
  onSelectReport,
  autoLocate = true,
}) {
  const [mapStyle, setMapStyle] = useState('osm'); // 'osm' | 'light' | 'satellite'
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [isTrackingLive, setIsTrackingLive] = useState(false);
  const [flyTarget, setFlyTarget] = useState(null);
  const watchIdRef = useRef(null);

  // Auto-locate real-time location on component mount
  useEffect(() => {
    if (autoLocate) {
      requestLiveLocation(true);
    }

    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [autoLocate]);

  const requestLiveLocation = (shouldFly = true) => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        const accuracy = Math.round(position.coords.accuracy || 20);

        const newLoc = { lat, lng, accuracy, timestamp: Date.now() };
        setUserLocation(newLoc);

        if (shouldFly) {
          setFlyTarget({ lat, lng, zoom: 15, id: Date.now() });
        }
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Could not access GPS coordinates.';
        if (error.code === 1) msg = 'Location permission was denied by user.';
        else if (error.code === 2) msg = 'GPS position unavailable.';
        else if (error.code === 3) msg = 'Location request timed out.';
        setGeoError(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const toggleLiveTracking = () => {
    if (isTrackingLive) {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsTrackingLive(false);
    } else {
      if (!navigator.geolocation) {
        setGeoError('Geolocation unsupported.');
        return;
      }
      setIsTrackingLive(true);
      requestLiveLocation(true);

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const lat = Number(position.coords.latitude.toFixed(6));
          const lng = Number(position.coords.longitude.toFixed(6));
          const accuracy = Math.round(position.coords.accuracy || 20);
          setUserLocation({ lat, lng, accuracy, timestamp: Date.now() });
        },
        (err) => console.warn('Watch position error:', err),
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 1000 }
      );
    }
  };

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

  const userBeaconIcon = createUserLocationIcon();

  return (
    <div
      style={{ height }}
      className="w-full rounded-2xl overflow-hidden border border-sage-200 shadow-soft-md relative z-0 group"
    >
      {/* Floating Map HUD Top Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left Telemetry Capsule */}
        <div className="pointer-events-auto bg-white px-4 py-2 rounded-xl border border-sage-200 shadow-soft flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 text-charcoal-800 font-semibold">
            <span className="w-2 h-2 rounded-full bg-forest-700" />
            <span className="text-forest-900">{reports.length} Incidents</span>
          </div>

          {userLocation && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-charcoal-600 border-l border-sage-200 pl-3">
              <Crosshair className="w-3.5 h-3.5 text-forest-700" />
              <span className="font-medium">GPS: {userLocation.lat.toFixed(4)}°, {userLocation.lng.toFixed(4)}°</span>
            </div>
          )}

          {highSeverityCount > 0 && (
            <div className="flex items-center gap-1.5 text-rose-700 font-semibold border-l border-sage-200 pl-3">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>{highSeverityCount} Critical</span>
            </div>
          )}
        </div>

        {/* Right Real-time GPS & Map Layer Switcher */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Real-time Locate Me Button */}
          <button
            onClick={() => requestLiveLocation(true)}
            disabled={isLocating}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 border ${
              userLocation
                ? 'bg-forest-50 text-forest-900 border-forest-200 hover:bg-forest-100'
                : 'bg-white text-charcoal-800 border-sage-200 hover:bg-sage-50'
            }`}
            title="Recenter on your real-time current location"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-forest-700' : 'text-forest-700'}`} />
            <span>{isLocating ? 'Acquiring GPS...' : userLocation ? 'Live Location' : 'Locate Me'}</span>
          </button>

          {/* Map Layer Mode Switcher */}
          <div className="bg-white p-1 rounded-lg border border-sage-200 shadow-soft flex items-center gap-1 text-xs">
            <button
              onClick={() => setMapStyle('osm')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                mapStyle === 'osm'
                  ? 'bg-forest-100 text-forest-900'
                  : 'text-charcoal-600 hover:bg-sage-50 hover:text-forest-900'
              }`}
            >
              GIS Standard
            </button>
            <button
              onClick={() => setMapStyle('light')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                mapStyle === 'light'
                  ? 'bg-forest-100 text-forest-900'
                  : 'text-charcoal-600 hover:bg-sage-50 hover:text-forest-900'
              }`}
            >
              Clean Canvas
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                mapStyle === 'satellite'
                  ? 'bg-forest-100 text-forest-900'
                  : 'text-charcoal-600 hover:bg-sage-50 hover:text-forest-900'
              }`}
            >
              Satellite
            </button>
          </div>
        </div>
      </div>

      {geoError && (
        <div className="absolute top-16 left-4 right-4 z-[1000] pointer-events-auto p-2.5 rounded-2xl bg-amber-500/90 backdrop-blur-md border border-amber-300 text-white text-xs font-bold flex items-center justify-between shadow-lg max-w-md mx-auto">
          <span>{geoError}</span>
          <button onClick={() => setGeoError(null)} className="ml-2 hover:opacity-75">✕</button>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <MapPanController target={flyTarget} />

        <TileLayer
          key={mapStyle}
          attribution={tileLayers[mapStyle].attribution}
          url={tileLayers[mapStyle].url}
        />

        {/* Real-time User Live Location Beacon */}
        {userLocation && (
          <>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={Math.max(userLocation.accuracy, 40)}
              pathOptions={{
                color: '#74D7CB',
                fillColor: '#74D7CB',
                fillOpacity: 0.15,
                weight: 1.5,
              }}
            />
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userBeaconIcon}
            >
              <Popup>
                <div className="p-3 text-xs font-sans text-left space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-forest-700" />
                    <span className="font-extrabold text-sm text-[#092421]">Your Live Location</span>
                  </div>
                  <p className="font-mono text-[11px] text-[#556E55]">
                    {userLocation.lat.toFixed(6)}°, {userLocation.lng.toFixed(6)}°
                  </p>
                  <div className="text-[10px] text-[#1B4332] font-semibold bg-[#DEF5F1] px-2 py-0.5 rounded-md inline-block">
                    Real-time GPS Precision (~{userLocation.accuracy}m)
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

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
