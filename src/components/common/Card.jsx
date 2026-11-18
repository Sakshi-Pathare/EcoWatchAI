import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({
  children,
  className,
  hover = false,
  glass = false,
  onClick,
  accent = false,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          'rounded-2xl transition-all duration-300 relative overflow-hidden',
          glass
            ? 'glass-panel'
            : 'bg-white border border-sage-200/90 shadow-soft',
          hover && 'glass-card-hover cursor-pointer hover:border-forest-300/80',
          accent && 'before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-forest-600 before:via-limeaccent-500 before:to-forest-700',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, title, subtitle, icon: Icon, action }) {
  return (
    <div className={twMerge(clsx('p-5 sm:p-6 border-b border-sage-100 flex items-center justify-between gap-4', className))}>
      {title ? (
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-forest-50 border border-forest-100 text-forest-700 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-charcoal-900 tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-charcoal-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      ) : (
        children
      )}
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ children, className }) {
  return <div className={twMerge(clsx('p-5 sm:p-6', className))}>{children}</div>;
}

export function CardFooter({ children, className }) {
  return (
    <div className={twMerge(clsx('px-5 sm:px-6 py-4 bg-offwhite-100/90 border-t border-sage-100 text-xs text-charcoal-500 flex items-center justify-between', className))}>
      {children}
    </div>
  );
}
