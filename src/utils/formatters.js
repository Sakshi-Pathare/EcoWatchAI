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
        bg: 'bg-rose-50 text-rose-900 border-rose-300 font-bold',
        dot: 'bg-rose-600',
        colorHex: '#E11D48',
      };
    case 'medium':
      return {
        label: 'Moderate Impact',
        bg: 'bg-amber-50 text-amber-950 border-amber-300 font-bold',
        dot: 'bg-amber-500',
        colorHex: '#D97706',
      };
    case 'low':
    default:
      return {
        label: 'Low Impact',
        bg: 'bg-[#DEF5F1] text-[#092421] border-[#74D7CB]/50 font-bold',
        dot: 'bg-[#2F665F]',
        colorHex: '#74D7CB',
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
        bg: 'bg-[#DEF5F1] text-[#092421] border-[#74D7CB]/60 font-bold',
        dot: 'bg-[#2F665F]',
      };
    case 'scheduled':
    case 'in_progress':
    case 'in progress':
      return {
        label: 'Cleanup Scheduled',
        bg: 'bg-blue-50 text-blue-950 border-blue-300 font-bold',
        dot: 'bg-blue-600',
      };
    case 'verified':
      return {
        label: 'Verified by Admin',
        bg: 'bg-amber-50 text-amber-950 border-amber-300 font-bold',
        dot: 'bg-amber-500',
      };
    case 'pending':
    default:
      return {
        label: 'Under Review',
        bg: 'bg-beige-200 text-[#092421] border-beige-300 font-bold',
        dot: 'bg-[#27403C]',
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

