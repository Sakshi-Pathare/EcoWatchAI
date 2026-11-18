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
    forest: 'bg-sage-100/90 text-darkgreen-800 border border-sage-300 shadow-[0_2px_8px_rgba(24,61,43,0.08)]',
    amber: 'bg-amber-100/90 text-amber-900 border border-amber-300 shadow-[0_2px_8px_rgba(217,119,6,0.08)]',
    rose: 'bg-rose-100/90 text-rose-900 border border-rose-300 shadow-[0_2px_8px_rgba(225,29,72,0.08)]',
    blue: 'bg-blue-100/90 text-blue-900 border border-blue-300 shadow-[0_2px_8px_rgba(37,99,235,0.08)]',
    lime: 'bg-botanical-100 text-botanical-900 border border-botanical-300 shadow-[0_2px_8px_rgba(43,119,76,0.12)]',
  };

  const glows = {
    forest: 'group-hover:border-sage-400',
    amber: 'group-hover:border-amber-400',
    rose: 'group-hover:border-rose-400',
    blue: 'group-hover:border-blue-400',
    lime: 'group-hover:border-botanical-400',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'group relative bg-[#FAF8F5] rounded-2xl border border-beige-300/90 p-5 sm:p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-md backdrop-blur-sm overflow-hidden font-sans',
          glows[colorScheme],
          highlight && 'ring-2 ring-darkgreen-700/20 bg-gradient-to-br from-beige-50 via-white to-sage-50',
          className
        )
      )}
    >
      {/* Decorative ambient radial background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-sage-200/40 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8 transition-opacity duration-300 opacity-60 group-hover:opacity-100" />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-sage-600">
            {title}
          </p>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-darkgreen-950 mt-1.5 tracking-tight font-mono">
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
        <div className="relative z-10 mt-4 pt-3 border-t border-beige-200/80 flex items-center justify-between text-xs">
          {trend ? (
            <span
              className={clsx(
                'font-bold inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px]',
                trendPositive
                  ? 'bg-botanical-50 text-botanical-900 border border-botanical-200 font-mono'
                  : 'bg-rose-50 text-rose-900 border border-rose-200 font-mono'
              )}
            >
              {trendPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend}
            </span>
          ) : <span />}
          {subtext && <span className="text-charcoal-500 font-semibold text-[11px] truncate">{subtext}</span>}
        </div>
      )}
    </div>
  );
}
