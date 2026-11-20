import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Badge({
  children,
  variant = 'neutral', // 'forest' | 'sage' | 'beige' | 'emerald' | 'amber' | 'rose' | 'blue' | 'lime' | 'neutral'
  dot = false,
  pulse: _pulse = false,
  dotColor,
  size = 'sm', // 'xs' | 'sm' | 'md'
  className,
}) {
  const variants = {
    forest: 'bg-forest-50 text-forest-900 border-forest-200 font-semibold',
    sage: 'bg-sage-50 text-sage-900 border-sage-200 font-semibold',
    pista: 'bg-forest-50 text-forest-900 border-forest-200 font-semibold',
    beige: 'bg-beige-100 text-beige-900 border-beige-200 font-semibold',
    emerald: 'bg-emerald-50 text-emerald-900 border-emerald-200 font-semibold',
    amber: 'bg-amber-50 text-amber-900 border-amber-200 font-semibold',
    rose: 'bg-rose-50 text-rose-900 border-rose-200 font-semibold',
    blue: 'bg-blue-50 text-blue-900 border-blue-200 font-semibold',
    lime: 'bg-forest-50 text-forest-900 border-forest-200 font-semibold',
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
          'inline-flex items-center rounded-full border select-none font-sans',
          variants[variant] || variants.neutral,
          sizes[size],
          className
        )
      )}
    >
      {dot && (
        <span className="relative flex h-2 w-2 items-center justify-center">
          <span
            className={clsx('inline-flex h-1.5 w-1.5 rounded-full', dotColor || 'bg-current')}
          />
        </span>
      )}
      {children}
    </span>
  );
}
