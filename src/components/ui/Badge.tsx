import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'theme' | 'secondary' | 'outline' | 'success' | 'warning';
}

export function Badge({
  className,
  variant = 'theme',
  ...props
}: BadgeProps) {
  const variants = {
    theme: 'bg-theme-light text-theme border border-theme-light',
    secondary: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
    outline: 'border border-neutral-300 text-neutral-700 bg-white',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
