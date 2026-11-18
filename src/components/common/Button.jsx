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
  glow = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none relative overflow-hidden group active:scale-[0.98] font-sans';

  const variants = {
    primary: 'bg-gradient-to-r from-darkgreen-900 via-darkgreen-800 to-darkgreen-800 text-beige-50 hover:from-darkgreen-950 hover:to-darkgreen-900 focus:ring-darkgreen-600 shadow-soft-sm hover:shadow-soft-md border border-darkgreen-700/60',
    secondary: 'bg-sage-100 text-darkgreen-950 hover:bg-sage-200 active:bg-sage-300 focus:ring-sage-400 border border-sage-300/80 shadow-soft-xs',
    outline: 'border border-beige-400/90 text-darkgreen-950 bg-beige-50/90 backdrop-blur-sm hover:bg-beige-100 hover:border-darkgreen-600 active:bg-beige-200 focus:ring-darkgreen-600 shadow-soft-xs hover:shadow-soft-sm',
    ghost: 'text-darkgreen-900 hover:bg-sage-100/70 active:bg-sage-200 focus:ring-darkgreen-500',
    danger: 'bg-gradient-to-r from-rose-600 to-rose-700 text-white hover:from-rose-700 hover:to-rose-800 focus:ring-rose-500 shadow-soft-sm hover:shadow-soft-md border border-rose-500/40',
    lime: 'bg-gradient-to-r from-botanical-600 to-botanical-700 text-white font-bold hover:from-botanical-700 hover:to-botanical-800 focus:ring-botanical-500 shadow-soft hover:shadow-soft-md border border-botanical-500/60',
    glass: 'bg-beige-50/80 backdrop-blur-md text-darkgreen-950 border border-beige-300 hover:bg-white hover:border-darkgreen-400 shadow-glass',
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
          glow && 'shadow-glow-forest',
          className
        )
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Subtle glossy sheen sweep on hover */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

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
