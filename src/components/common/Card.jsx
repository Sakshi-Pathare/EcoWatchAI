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
          'rounded-2xl transition-all duration-300 relative overflow-hidden font-sans',
          glass
            ? 'glass-panel'
            : 'bg-[#FAF8F5] border border-beige-300/90 shadow-soft',
          hover && 'glass-card-hover cursor-pointer hover:border-sage-400',
          accent && 'before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-darkgreen-700 before:via-botanical-500 before:to-sage-500',
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
    <div className={twMerge(clsx('p-5 sm:p-6 border-b border-beige-200/80 flex items-center justify-between gap-4', className))}>
      {title ? (
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-sage-100 border border-sage-200 text-darkgreen-800 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div>
            <h3 className="text-base font-extrabold text-darkgreen-950 tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-sage-600 mt-0.5 font-medium">{subtitle}</p>}
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
    <div className={twMerge(clsx('px-5 sm:px-6 py-4 bg-beige-100/90 border-t border-beige-200/80 text-xs text-sage-600 flex items-center justify-between font-medium', className))}>
      {children}
    </div>
  );
}
