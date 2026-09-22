'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DialogContextValue {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue>({
  open: false,
});

export const Dialog: React.FC<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}> = ({ open = false, onOpenChange, children }) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

export const DialogTrigger: React.FC<{
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className, onClick }) => {
  const { onOpenChange } = React.useContext(DialogContext);
  return (
    <div
      className={className}
      onClick={() => {
        onOpenChange?.(true);
        onClick?.();
      }}
    >
      {children}
    </div>
  );
};

export const DialogPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;
  return createPortal(children, document.body);
};

export const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext);
  return (
    <div
      ref={ref}
      onClick={() => onOpenChange?.(false)}
      className={cn(
        'fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-200',
        className
      )}
      {...props}
    />
  );
});
DialogOverlay.displayName = 'DialogOverlay';

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open, onOpenChange } = React.useContext(DialogContext);

  // Close on Escape key
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange?.(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  // Lock body scroll when open
  React.useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'fixed left-1/2 top-1/2 z-[60] grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border border-neutral-200 bg-white p-6 shadow-2xl duration-200 rounded-2xl',
          className
        )}
        {...props}
      >
        {children}
        <button
          type="button"
          onClick={() => onOpenChange?.(false)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </DialogPortal>
  );
});
DialogContent.displayName = 'DialogContent';

export const DialogClose: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className, onClick, ...props }) => {
  const { onOpenChange } = React.useContext(DialogContext);
  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        onOpenChange?.(false);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

export const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      'text-xl font-bold font-display tracking-tight text-neutral-900',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-neutral-600', className)}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';
