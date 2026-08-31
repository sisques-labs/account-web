import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const numericBadgeVariants = cva(
  'inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold leading-none min-w-[1.25rem]',
  {
    variants: {
      variant: {
        default: 'bg-[var(--paper-2)] text-[var(--ink-2)]',
        primary: 'bg-[var(--forest)] text-[var(--white)]',
        danger: 'bg-[var(--terracotta)] text-[var(--white)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface NumericBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof numericBadgeVariants> {
  ref?: React.Ref<HTMLSpanElement>;
  count: number;
  max?: number;
}

const NumericBadge = ({ ref, className, count, max = 99, variant, ...props }: NumericBadgeProps) => {
  const display = count > max ? `${max}+` : String(count);
  return (
    <span ref={ref} className={cn(numericBadgeVariants({ variant }), className)} {...props}>
      {display}
    </span>
  );
};

NumericBadge.displayName = 'NumericBadge';

export { NumericBadge };
