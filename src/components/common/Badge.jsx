import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Badge({
  children,
  variant = 'neutral', // 'forest' | 'sage' | 'beige' | 'emerald' | 'amber' | 'rose' | 'blue' | 'lime' | 'neutral'
  dot = false,
  pulse = false,
  dotColor,
  size = 'sm', // 'xs' | 'sm' | 'md'
  className,
}) {
  const variants = {
    forest: 'bg-darkgreen-900/10 text-darkgreen-950 border-darkgreen-700/30 shadow-[0_1px_4px_rgba(24,61,43,0.06)] font-bold',
    sage: 'bg-sage-100/90 text-sage-950 border-sage-300 shadow-[0_1px_4px_rgba(113,139,111,0.08)] font-bold',
    beige: 'bg-beige-200/90 text-beige-900 border-beige-300 shadow-[0_1px_4px_rgba(223,213,196,0.12)] font-bold',
    emerald: 'bg-botanical-50 text-botanical-900 border-botanical-300 shadow-[0_1px_4px_rgba(43,119,76,0.08)] font-bold',
    amber: 'bg-amber-50/95 text-amber-950 border-amber-300 shadow-[0_1px_4px_rgba(217,119,6,0.08)] font-bold',
    rose: 'bg-rose-50/95 text-rose-950 border-rose-300 shadow-[0_1px_4px_rgba(225,29,72,0.08)] font-bold',
    blue: 'bg-blue-50/95 text-blue-950 border-blue-300 shadow-[0_1px_4px_rgba(37,99,235,0.08)] font-bold',
    lime: 'bg-limeaccent-100 text-limeaccent-950 border-limeaccent-300 shadow-[0_1px_4px_rgba(113,148,22,0.12)] font-black',
    neutral: 'bg-beige-200/80 text-charcoal-800 border-beige-300/90',
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
          'inline-flex items-center rounded-full font-bold border transition-all backdrop-blur-sm select-none font-sans',
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
