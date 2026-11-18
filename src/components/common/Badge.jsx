import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Badge({
  children,
  variant = 'neutral', // 'forest' | 'sage' | 'emerald' | 'amber' | 'rose' | 'blue' | 'lime' | 'neutral'
  dot = false,
  pulse = false,
  dotColor,
  size = 'sm', // 'xs' | 'sm' | 'md'
  className,
}) {
  const variants = {
    forest: 'bg-forest-50/90 text-forest-900 border-forest-200/80 shadow-[0_1px_4px_rgba(24,71,48,0.06)]',
    sage: 'bg-sage-100/90 text-sage-900 border-sage-200/90',
    emerald: 'bg-emerald-50/90 text-emerald-800 border-emerald-200/80 shadow-[0_1px_4px_rgba(5,150,105,0.08)]',
    amber: 'bg-amber-50/90 text-amber-900 border-amber-200/80 shadow-[0_1px_4px_rgba(217,119,6,0.08)]',
    rose: 'bg-rose-50/90 text-rose-800 border-rose-200/80 shadow-[0_1px_4px_rgba(225,29,72,0.08)]',
    blue: 'bg-blue-50/90 text-blue-800 border-blue-200/80 shadow-[0_1px_4px_rgba(37,99,235,0.08)]',
    lime: 'bg-limeaccent-100 text-limeaccent-900 border-limeaccent-300 shadow-[0_1px_4px_rgba(101,163,13,0.12)] font-bold',
    neutral: 'bg-slate-100/90 text-slate-700 border-slate-200/80',
  };

  const sizes = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-2',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center rounded-full font-semibold border transition-all backdrop-blur-sm select-none',
          variants[variant] || variants.neutral,
          sizes[size],
          className
        )
      )}
    >
      {dot && (
        <span className="relative flex h-2 w-2 items-center justify-center">
          {pulse && (
            <span
              className={clsx(
                'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
                dotColor || 'bg-current'
              )}
            />
          )}
          <span
            className={clsx('relative inline-flex h-1.5 w-1.5 rounded-full', dotColor || 'bg-current')}
          />
        </span>
      )}
      {children}
    </span>
  );
}
