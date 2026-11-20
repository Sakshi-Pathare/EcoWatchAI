import L from 'leaflet';

export function createSeverityIcon(severity) {
  let color = '#059669'; // low = emerald
  let innerHtml = '<circle cx="12" cy="12" r="4" fill="#FFFFFF"/>';

  if (severity === 'high' || severity === 'critical') {
    color = '#E11D48'; // crimson
    innerHtml = '<path d="M12 8v4m0 3h.01" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>';
  } else if (severity === 'medium') {
    color = '#D97706'; // amber
    innerHtml = '<path d="M12 9v3m0 3h.01" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>';
  }

  const svg = `
    <div style="position: relative; width: 36px; height: 44px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.18)); cursor: pointer;">
      <svg width="36" height="44" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -42],
  });
}

export function createPickerIcon() {
  const svg = `
    <div style="position: relative; width: 38px; height: 46px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.18));">
      <svg width="38" height="46" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 0C7.61116 0 0 7.61116 0 17C0 27.5 17 42 17 42C17 42 34 27.5 34 17C34 7.61116 26.3888 0 17 0Z" fill="#184730"/>
        <circle cx="17" cy="17" r="11" fill="rgba(255,255,255,0.25)"/>
        <circle cx="17" cy="17" r="6" fill="#84CC16"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-picker-marker',
    iconSize: [38, 46],
    iconAnchor: [19, 46],
    popupAnchor: [0, -44],
  });
}

export function createUserLocationIcon() {
  const html = `
    <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; pointer-events: none;">
      <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(47, 107, 79, 0.12); border: 2px solid rgba(47, 107, 79, 0.55);"></div>
      <div style="position: relative; width: 14px; height: 14px; border-radius: 50%; background: #2F6B4F; border: 3px solid #FFFFFF;"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'user-live-location-beacon',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -24],
  });
}
