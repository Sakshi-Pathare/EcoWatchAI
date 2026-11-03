import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { createPickerIcon } from './mapIcons';
import { Navigation, MapPin } from 'lucide-react';
import { Button } from '../common/Button';

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
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

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false);
        handleLocationSelect(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setGeoLoading(false);
        setGeoError('Could not retrieve GPS coordinates. Please select manually on the map.');
      },
      { timeout: 10000, enableHighAccuracy: true }
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
        <div className="absolute top-3 right-3 z-[1000]">
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
        <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
          {geoError}
        </p>
      )}
    </div>
  );
}

