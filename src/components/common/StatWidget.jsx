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
    forest: 'bg-pista-100 text-[#092421] border border-pista-300 shadow-[0_2px_8px_rgba(116,215,203,0.18)]',
    amber: 'bg-amber-100/90 text-amber-900 border border-amber-300 shadow-[0_2px_8px_rgba(217,119,6,0.08)]',
    rose: 'bg-rose-100/90 text-rose-900 border border-rose-300 shadow-[0_2px_8px_rgba(225,29,72,0.08)]',
    blue: 'bg-blue-100/90 text-blue-900 border border-blue-300 shadow-[0_2px_8px_rgba(37,99,235,0.08)]',
    lime: 'bg-pista-200 text-[#092421] border border-pista-400 shadow-[0_2px_8px_rgba(116,215,203,0.22)]',
    pista: 'bg-pista-100 text-[#092421] border border-pista-300 shadow-[0_2px_8px_rgba(116,215,203,0.2)]',
  };

  const glows = {
    forest: 'group-hover:border-pista-400',
    amber: 'group-hover:border-amber-400',
    rose: 'group-hover:border-rose-400',
    blue: 'group-hover:border-blue-400',
    lime: 'group-hover:border-pista-400',
    pista: 'group-hover:border-pista-400',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'group relative card-paper rounded-[1.75rem] p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg overflow-hidden font-sans',
          glows[colorScheme],
          highlight && 'border-[#74D7CB]/60 ring-2 ring-[#74D7CB]/30',
          className
        )
      )}
    >
      {/* Decorative ambient radial background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#74D7CB]/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8 transition-opacity duration-300 opacity-60 group-hover:opacity-100" />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#556E55]">
            {title}
          </p>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-[#10241B] mt-1.5 tracking-tight font-serif">
            {value}
          </h4>
        </div>
        {Icon && (
          <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110', iconBgs[colorScheme])}>
            <Icon className="w-5 h-5 text-[#10241B]" />
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="relative z-10 mt-4 pt-3 border-t border-[#1B4332]/10 flex items-center justify-between text-xs">
          {trend ? (
            <span
              className={clsx(
                'font-bold inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono',
                trendPositive
                  ? 'bg-[#DEF5F1] text-[#092421] border border-[#98E0D5]'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              )}
            >
              {trendPositive ? <TrendingUp className="w-3 h-3 text-[#2D6A4F]" /> : <TrendingDown className="w-3 h-3 text-rose-600" />}
              {trend}
            </span>
          ) : <span />}
          {subtext && <span className="text-[#556E55] font-semibold text-[11px] truncate">{subtext}</span>}
        </div>
      )}
    </div>
  );
}
