import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function StatWidget({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendPositive = true,
  className,
  colorScheme = 'forest', // 'forest' | 'amber' | 'rose' | 'blue'
}) {
  const iconBgs = {
    forest: 'bg-forest-50 text-forest-700 border border-forest-200/60',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    rose: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200/60',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'bg-white rounded-xl border border-sage-200/80 p-5 shadow-soft hover:shadow-soft-md transition-shadow',
          className
        )
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-charcoal-500">{title}</p>
          <h4 className="text-2xl font-bold text-charcoal-900 mt-1.5 tracking-tight">{value}</h4>
        </div>
        {Icon && (
          <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', iconBgs[colorScheme])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-3.5 pt-3 border-t border-sage-100 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={clsx(
                'font-medium inline-flex items-center gap-0.5',
                trendPositive ? 'text-forest-700' : 'text-rose-600'
              )}
            >
              {trend}
            </span>
          )}
          {subtext && <span className="text-charcoal-500">{subtext}</span>}
        </div>
      )}
    </div>
  );
}

