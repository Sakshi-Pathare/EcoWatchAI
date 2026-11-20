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
          'card-paper rounded-[1.75rem] transition-all duration-300 relative overflow-hidden font-sans',
          hover && 'cursor-pointer hover:-translate-y-1 hover:shadow-soft-lg',
          accent && 'before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-[#10241B] before:via-[#2D6A4F] before:to-[#74D7CB] before:z-10',
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
    <div className={twMerge(clsx('p-5 sm:p-6 border-b border-[#1B4332]/10 flex items-center justify-between gap-4', className))}>
      {title ? (
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-2xl bg-[#DEF5F1] border border-[#98E0D5] text-[#10241B] flex items-center justify-center shrink-0 shadow-xs">
              <Icon className="w-5 h-5 text-[#1B4A45]" />
            </div>
          )}
          <div>
            <h3 className="text-base font-extrabold text-[#10241B] tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-[#556E55] mt-0.5 font-medium">{subtitle}</p>}
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
    <div className={twMerge(clsx('px-5 sm:px-6 py-4 bg-[#F7EFE6]/70 border-t border-[#1B4332]/10 text-xs text-[#556E55] flex items-center justify-between font-medium', className))}>
      {children}
    </div>
  );
}
