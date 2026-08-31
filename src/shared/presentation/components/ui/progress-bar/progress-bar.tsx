import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const progressBarVariants = cva('relative h-2 w-full overflow-hidden rounded-full bg-[var(--paper-2)]', {
  variants: {
    variant: {
      determinate: '',
      indeterminate: '',
      stepped: 'flex gap-1 bg-transparent overflow-visible',
    },
  },
  defaultVariants: {
    variant: 'determinate',
  },
});

export interface ProgressBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof progressBarVariants> {
  ref?: React.Ref<HTMLDivElement>;
  value?: number;
  steps?: number;
  currentStep?: number;
}

const ProgressBar = ({ ref, className, variant = 'determinate', value = 0, steps = 1, currentStep = 0, ...props }: ProgressBarProps) => {
  if (variant === 'stepped') {
    return (
      <div ref={ref} className={cn(progressBarVariants({ variant }), className)} {...props}>
        {Array.from({ length: steps }, (_, i) => (
          <div
            key={i}
            data-segment
            data-completed={i < currentStep ? 'true' : 'false'}
            className={cn(
              'h-2 flex-1 rounded-full',
              i < currentStep ? 'bg-[var(--forest)]' : 'bg-[var(--paper-2)]',
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === 'indeterminate') {
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(progressBarVariants({ variant }), className)}
        {...props}
      >
        <div className="absolute h-full w-2/5 rounded-full bg-[var(--forest)] animate-progress-indeterminate" />
      </div>
    );
  }

  // determinate
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={cn(progressBarVariants({ variant }), className)}
      {...props}
    >
      <div
        data-fill
        className="h-full rounded-full bg-[var(--forest)] transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';

export { ProgressBar };
