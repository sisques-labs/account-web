import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const calloutVariants = cva('rounded border-l-4 p-4 flex flex-col gap-1', {
  variants: {
    variant: {
      note: 'bg-[var(--paper-2)] border-[var(--rule)] text-[var(--ink-2)]',
      info: 'bg-[var(--forest-bg)] border-[var(--forest)] text-[var(--forest)]',
      warning: 'bg-[var(--honey-bg)] border-[var(--honey)] text-[var(--ink)]',
      success: 'bg-[var(--forest-bg)] border-[var(--forest-2)] text-[var(--forest)]',
      danger: 'bg-[var(--terra-bg)] border-[var(--terracotta)] text-[var(--terracotta)]',
    },
  },
  defaultVariants: {
    variant: 'note',
  },
});

export interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {
  ref?: React.Ref<HTMLDivElement>;
  icon?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
}

const Callout = ({ className, variant, icon, title, children, ref, ...props }: CalloutProps) => (
  <div ref={ref} className={cn(calloutVariants({ variant }), className)} {...props}>
    {(icon || title) && (
      <div className="flex items-center gap-2">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {title && <strong className="text-sm font-semibold">{title}</strong>}
      </div>
    )}
    <div className="text-sm">{children}</div>
  </div>
);

Callout.displayName = 'Callout';

export { Callout };
