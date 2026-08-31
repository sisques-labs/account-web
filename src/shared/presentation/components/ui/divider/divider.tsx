import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const dividerVariants = cva('flex items-center gap-3 text-xs text-[var(--ink-3)]', {
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col h-full',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export interface DividerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dividerVariants> {
  ref?: React.Ref<HTMLDivElement>;
  label?: string;
}

const Divider = ({ ref, className, orientation, label, ...props }: DividerProps) => {
  const lineClass = orientation === 'vertical' ? 'flex-1 w-0.5 bg-[var(--rule)]' : 'flex-1 h-px bg-[var(--rule)]';

  if (!label) {
    return (
      <div ref={ref} className={cn(dividerVariants({ orientation }), className)} {...props}>
        <hr className={cn('flex-1 border-0', orientation === 'vertical' ? 'h-full w-px bg-[var(--rule)]' : 'h-px w-full bg-[var(--rule)]')} />
      </div>
    );
  }

  return (
    <div ref={ref} className={cn(dividerVariants({ orientation }), className)} {...props}>
      <div className={lineClass} />
      <span className="shrink-0 font-medium">{label}</span>
      <div className={lineClass} />
    </div>
  );
};

Divider.displayName = 'Divider';

export { Divider };
