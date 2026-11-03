import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ children, className, hover = false, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          'bg-white rounded-xl border border-sage-200/80 shadow-soft overflow-hidden transition-all duration-200',
          hover && 'hover:border-sage-300 hover:shadow-soft-md cursor-pointer',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, title, subtitle, action }) {
  return (
    <div className={twMerge(clsx('p-5 border-b border-sage-100 flex items-center justify-between gap-4', className))}>
      {title ? (
        <div>
          <h3 className="text-base font-semibold text-charcoal-900">{title}</h3>
          {subtitle && <p className="text-xs text-charcoal-500 mt-0.5">{subtitle}</p>}
        </div>
      ) : (
        children
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardBody({ children, className }) {
  return <div className={twMerge(clsx('p-5', className))}>{children}</div>;
}

export function CardFooter({ children, className }) {
  return <div className={twMerge(clsx('px-5 py-3.5 bg-offwhite-100 border-t border-sage-100 text-xs text-charcoal-500 flex items-center justify-between', className))}>{children}</div>;
}

