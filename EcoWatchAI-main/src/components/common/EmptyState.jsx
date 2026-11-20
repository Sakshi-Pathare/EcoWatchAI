import React from 'react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon,
  title = 'No items found',
  description = 'There is currently no data to display matching your criteria.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="text-center py-12 px-4 rounded-xl border border-dashed border-sage-300 bg-white/60 my-4">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-sage-100 text-forest-700 flex items-center justify-center mx-auto mb-3.5">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-base font-semibold text-charcoal-900">{title}</h3>
      <p className="text-sm text-charcoal-500 max-w-sm mx-auto mt-1 mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

