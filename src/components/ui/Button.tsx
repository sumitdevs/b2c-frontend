import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'theme' | 'outline' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'theme',
      size = 'md',
      isLoading = false,
      type = 'button',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer';

    const variants = {
      theme:
        'bg-theme text-white hover:bg-theme-hover shadow-sm shadow-red-500/10 focus-visible:ring-[var(--theme-primary-ring)]',
      outline:
        'border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400 focus-visible:ring-neutral-400',
      secondary:
        'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 focus-visible:ring-neutral-400',
      ghost:
        'bg-transparent text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-400 shadow-sm',
    };

    const sizes = {
      sm: 'text-xs h-8 px-3 gap-1.5',
      md: 'text-sm h-10 px-4 py-2 gap-2',
      lg: 'text-base h-12 px-6 py-3 gap-2.5 font-semibold',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
