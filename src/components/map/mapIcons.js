import L from 'leaflet';

export function createSeverityIcon(severity) {
  let color = '#059669'; // low = emerald
  let haloHtml = '';
  let innerHtml = '<circle cx="12" cy="12" r="4" fill="#FFFFFF"/>';

  if (severity === 'high' || severity === 'critical') {
    color = '#E11D48'; // crimson
    innerHtml = '<path d="M12 8v4m0 3h.01" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>';
    haloHtml = `
      <div style="position: absolute; top: 5px; left: 5px; width: 26px; height: 26px; border-radius: 50%; background: rgba(225, 29, 72, 0.4); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; pointer-events: none;"></div>
    `;
  } else if (severity === 'medium') {
    color = '#D97706'; // amber
    innerHtml = '<path d="M12 9v3m0 3h.01" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>';
    haloHtml = `
      <div style="position: absolute; top: 6px; left: 6px; width: 24px; height: 24px; border-radius: 50%; background: rgba(217, 119, 6, 0.3); animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite; pointer-events: none;"></div>
    `;
  }

  const svg = `
    <div style="position: relative; width: 36px; height: 44px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 6px 8px rgba(0,0,0,0.3)); cursor: pointer; transition: transform 0.2s ease;">
      ${haloHtml}
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
    <div style="position: relative; width: 38px; height: 46px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 8px 14px rgba(24,71,48,0.45));">
      <div style="position: absolute; top: 6px; left: 6px; width: 26px; height: 26px; border-radius: 50%; background: rgba(132, 204, 22, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; pointer-events: none;"></div>
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
