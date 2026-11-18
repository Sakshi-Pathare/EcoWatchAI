import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { createPickerIcon } from './mapIcons';
import { Navigation, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapPanController({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target && target.lat && target.lng) {
      map.flyTo([target.lat, target.lng], 15, { duration: 1.2 });
    }
  }, [target, map]);
  return null;
}

export function LocationPickerMap({
  latitude,
  longitude,
  onChange,
  height = '320px',
}) {
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [geoSuccess, setGeoSuccess] = useState(false);
  const [flyTarget, setFlyTarget] = useState(null);

  const currentLat = latitude || 37.7749;
  const currentLng = longitude || -122.4194;

  const handleLocationSelect = (lat, lng) => {
    onChange(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    setGeoSuccess(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false);
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        handleLocationSelect(lat, lng);
        setFlyTarget({ lat, lng, id: Date.now() });
        setGeoSuccess(true);
        setTimeout(() => setGeoSuccess(false), 3500);
      },
      (err) => {
        setGeoLoading(false);
        let errorMsg = 'Could not retrieve GPS coordinates. Please select manually on the map.';
        if (err.code === 1) { // PERMISSION_DENIED
          errorMsg = 'Location permission was denied. Please allow location access in your browser or click on the map to set your report location.';
        } else if (err.code === 2) { // POSITION_UNAVAILABLE
          errorMsg = 'GPS signal unavailable. Please ensure location services are enabled or click directly on the map.';
        } else if (err.code === 3) { // TIMEOUT
          errorMsg = 'GPS location request timed out. Please try again or click directly on the map.';
        }
        setGeoError(errorMsg);
      },
      { timeout: 12000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  const pickerIcon = createPickerIcon();

  return (
    <div className="space-y-2">
      <div className="relative rounded-xl overflow-hidden border border-sage-300 shadow-inner" style={{ height }}>
        <MapContainer
          center={[currentLat, currentLng]}
          zoom={14}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onLocationSelect={handleLocationSelect} />
          <MapPanController target={flyTarget} />

          <Marker
            position={[currentLat, currentLng]}
            icon={pickerIcon}
            draggable={true}
            eventHandlers={{
              dragend(e) {
                const marker = e.target;
                const position = marker.getLatLng();
                handleLocationSelect(position.lat, position.lng);
              },
            }}
          />
        </MapContainer>

        {/* Floating Geo Button */}
        <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2">
          {geoSuccess && (
            <span className="bg-forest-800 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-limeaccent-300" />
              <span>Location Locked</span>
            </span>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={Navigation}
            loading={geoLoading}
            onClick={handleGetCurrentLocation}
            className="bg-white/95 shadow-md text-xs py-1.5"
          >
            Locate Me
          </Button>
        </div>

        {/* Instructions banner */}
        <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-sage-200 text-xs text-charcoal-700 flex items-center justify-between shadow-soft">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-forest-700" />
            <span>Click map or drag pin to adjust report location</span>
          </div>
          <span className="font-mono text-[11px] font-semibold text-forest-800">
            {currentLat.toFixed(4)}°, {currentLng.toFixed(4)}°
          </span>
        </div>
      </div>

      {geoError && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{geoError}</span>
        </div>
      )}
    </div>
  );
}

