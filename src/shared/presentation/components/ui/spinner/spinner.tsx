import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const spinnerVariants = cva(
  'inline-block rounded-full border-2 border-current border-t-transparent animate-[spin-ring_0.7s_linear_infinite]',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-10 w-10',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  ref?: React.Ref<HTMLSpanElement>;
  label?: string;
}

const Spinner = ({ className, size, label = 'Loading…', ref, ...props }: SpinnerProps) => (
  <span ref={ref} role="status" className={cn(spinnerVariants({ size }), className)} {...props}>
    <span className="sr-only">{label}</span>
  </span>
);

Spinner.displayName = 'Spinner';

export { Spinner };
