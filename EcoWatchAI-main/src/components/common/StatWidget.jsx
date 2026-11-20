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
    forest: 'bg-forest-50 text-forest-800 border border-forest-100',
    amber: 'bg-amber-50 text-amber-800 border border-amber-100',
    rose: 'bg-rose-50 text-rose-800 border border-rose-100',
    blue: 'bg-blue-50 text-blue-800 border border-blue-100',
    lime: 'bg-forest-50 text-forest-800 border border-forest-100',
    pista: 'bg-forest-50 text-forest-800 border border-forest-100',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'group relative card-paper rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:shadow-soft-md overflow-hidden font-sans',
          highlight && 'border-forest-300',
          className
        )
      )}
    >
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
          <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', iconBgs[colorScheme])}>
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
