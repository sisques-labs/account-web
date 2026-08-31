import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const pillVariants = cva(
  'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer border',
  {
    variants: {
      active: {
        true: 'bg-[var(--forest)] text-[var(--white)] border-[var(--forest)]',
        false: 'bg-[var(--paper)] text-[var(--ink-2)] border-[var(--rule)] hover:bg-[var(--paper-2)]',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export interface SortPillOption {
  value: string;
  label: string;
}

export interface SortPillsProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  options: SortPillOption[];
  value?: string;
  onSort?: (value: string) => void;
}

const SortPills = ({ className, options, value, onSort, ref, ...props }: SortPillsProps) => (
  <div ref={ref} className={cn('flex flex-wrap gap-2', className)} {...props}>
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onSort?.(opt.value)}
        className={pillVariants({ active: opt.value === value })}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

SortPills.displayName = 'SortPills';

export { SortPills };
