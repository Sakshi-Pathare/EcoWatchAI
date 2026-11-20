import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'lime' | 'glass'
  size = 'md', // 'sm' | 'md' | 'lg' | 'xs'
  icon: Icon,
  iconPosition = 'left',
  className,
  disabled,
  loading,
  glow: _glow = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-colors duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none group active:translate-y-px font-sans';

  const variants = {
    primary: 'bg-forest-800 text-white hover:bg-forest-900 focus:ring-forest-600 border border-forest-800',
    secondary: 'bg-sage-100 text-forest-900 hover:bg-sage-200 active:bg-sage-300 focus:ring-sage-500 border border-sage-200',
    pista: 'bg-forest-100 hover:bg-forest-200 text-forest-900 focus:ring-forest-600 border border-forest-200',
    outline: 'border border-sage-300 text-charcoal-800 bg-white hover:bg-sage-50 hover:border-sage-400 active:bg-sage-100 focus:ring-forest-600',
    ghost: 'text-forest-900 hover:bg-sage-100 active:bg-sage-200 focus:ring-forest-600',
    danger: 'bg-rose-700 text-white hover:bg-rose-800 focus:ring-rose-500 border border-rose-700',
    lime: 'bg-forest-100 hover:bg-forest-200 text-forest-900 border border-forest-200 focus:ring-forest-600',
    glass: 'bg-white text-forest-900 border border-sage-200 hover:bg-sage-50 focus:ring-forest-600',
  };

  const sizes = {
    xs: 'text-xs px-2.5 py-1 gap-1',
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      className={twMerge(
        clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon && iconPosition === 'left' ? (
        <Icon className={clsx(size === 'sm' || size === 'xs' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4', 'shrink-0 transition-transform group-hover:scale-110')} />
      ) : null}

      <span className="relative z-10">{children}</span>

      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={clsx(size === 'sm' || size === 'xs' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4', 'shrink-0 transition-transform group-hover:scale-110')} />
      )}
    </button>
  );
}
