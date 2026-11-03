import L from 'leaflet';

export function createSeverityIcon(severity) {
  let color = '#059669'; // low = emerald
  let innerHtml = '<circle cx="12" cy="12" r="4" fill="#FFFFFF"/>';

  if (severity === 'high' || severity === 'critical') {
    color = '#E11D48'; // crimson
    innerHtml = '<path d="M12 8v4m0 3h.01" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>';
  } else if (severity === 'medium') {
    color = '#D97706'; // amber
    innerHtml = '<path d="M12 9v3m0 3h.01" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>';
  }

  const svg = `
    <div style="position: relative; width: 34px; height: 42px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.25)); transition: transform 0.15s ease;">
      <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 0C7.61116 0 0 7.61116 0 17C0 27.5 17 42 17 42C17 42 34 27.5 34 17C34 7.61116 26.3888 0 17 0Z" fill="${color}"/>
        <circle cx="17" cy="17" r="11" fill="rgba(255,255,255,0.25)"/>
        <g transform="translate(5, 5)">
          ${innerHtml}
        </g>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [34, 42],
    iconAnchor: [17, 42],
    popupAnchor: [0, -40],
  });
}

export function createPickerIcon() {
  const svg = `
    <div style="position: relative; width: 36px; height: 44px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 6px 10px rgba(24,71,48,0.4)); animation: bounce 1s infinite alternate;">
      <svg width="36" height="44" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 0C7.61116 0 0 7.61116 0 17C0 27.5 17 42 17 42C17 42 34 27.5 34 17C34 7.61116 26.3888 0 17 0Z" fill="#184730"/>
        <circle cx="17" cy="17" r="7" fill="#84CC16"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-picker-marker',
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -42],
  });
}

