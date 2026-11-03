export function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-US').format(num);
}

export function getSeverityBadgeProps(severity) {
  switch (severity?.toLowerCase()) {
    case 'high':
    case 'critical':
      return {
        label: 'Critical Priority',
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        colorHex: '#E11D48',
      };
    case 'medium':
      return {
        label: 'Moderate Impact',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        colorHex: '#D97706',
      };
    case 'low':
    default:
      return {
        label: 'Low Impact',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        colorHex: '#059669',
      };
  }
}

export function getStatusBadgeProps(status) {
  switch (status?.toLowerCase()) {
    case 'cleaned':
    case 'resolved':
    case 'completed':
      return {
        label: 'Cleaned & Verified',
        bg: 'bg-forest-50 text-forest-700 border-forest-200',
        dot: 'bg-forest-600',
      };
    case 'scheduled':
    case 'in_progress':
    case 'in progress':
      return {
        label: 'Cleanup Scheduled',
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-600',
      };
    case 'verified':
      return {
        label: 'Verified by Admin',
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'pending':
    default:
      return {
        label: 'Under Review',
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
      };
  }
}

export function getCategoryLabel(category) {
  const map = {
    plastic: 'Plastics & Packaging',
    organic: 'Organic & Food Waste',
    metal: 'Metal & Cans',
    glass: 'Glass Bottles & Shards',
    hazardous: 'Chemical & E-Waste',
    paper: 'Paper & Cardboard',
    mixed: 'Mixed Public Litter',
  };
  return map[category] || category || 'General Litter';
}

