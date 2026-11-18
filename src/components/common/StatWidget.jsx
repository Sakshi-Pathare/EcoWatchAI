import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatWidget({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendPositive = true,
  className,
  colorScheme = 'forest', // 'forest' | 'amber' | 'rose' | 'blue' | 'lime'
  highlight = false,
}) {
  const iconBgs = {
    forest: 'bg-forest-50/90 text-forest-700 border border-forest-200/80 shadow-[0_2px_8px_rgba(24,71,48,0.08)]',
    amber: 'bg-amber-50/90 text-amber-700 border border-amber-200/80 shadow-[0_2px_8px_rgba(217,119,6,0.08)]',
    rose: 'bg-rose-50/90 text-rose-700 border border-rose-200/80 shadow-[0_2px_8px_rgba(225,29,72,0.08)]',
    blue: 'bg-blue-50/90 text-blue-700 border border-blue-200/80 shadow-[0_2px_8px_rgba(37,99,235,0.08)]',
    lime: 'bg-limeaccent-100 text-limeaccent-900 border border-limeaccent-300 shadow-[0_2px_8px_rgba(101,163,13,0.12)]',
  };

  const glows = {
    forest: 'group-hover:border-forest-300',
    amber: 'group-hover:border-amber-300',
    rose: 'group-hover:border-rose-300',
    blue: 'group-hover:border-blue-300',
    lime: 'group-hover:border-limeaccent-400',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'group relative bg-white/95 rounded-2xl border border-sage-200/90 p-5 sm:p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-md backdrop-blur-sm overflow-hidden',
          glows[colorScheme],
          highlight && 'ring-2 ring-forest-500/20 bg-gradient-to-br from-white via-white to-forest-50/40',
          className
        )
      )}
    >
      {/* Decorative ambient radial background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-forest-100/30 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8 transition-opacity duration-300 opacity-60 group-hover:opacity-100" />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
            {title}
          </p>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-1.5 tracking-tight">
            {value}
          </h4>
        </div>
        {Icon && (
          <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110', iconBgs[colorScheme])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="relative z-10 mt-4 pt-3 border-t border-sage-100/80 flex items-center justify-between text-xs">
          {trend ? (
            <span
              className={clsx(
                'font-bold inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px]',
                trendPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/70'
              )}
            >
              {trendPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend}
            </span>
          ) : <span />}
          {subtext && <span className="text-charcoal-500 font-medium text-[11px] truncate">{subtext}</span>}
        </div>
      )}
    </div>
  );
}
