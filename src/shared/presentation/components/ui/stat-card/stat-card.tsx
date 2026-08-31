import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  icon?: React.ReactNode;
}

const StatCard = ({ className, label, value, delta, deltaPositive, icon, ref, ...props }: StatCardProps) => (
  <div ref={ref} className={cn('card p-4', className)} {...props}>
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        <p className="eyebrow">{label}</p>
        <p className="headline tnum mt-1 text-2xl">{value}</p>
        {delta !== undefined && (
          <p
            className={cn(
              'mt-1 text-xs font-medium',
              deltaPositive ? 'text-[var(--forest)]' : 'text-[var(--terracotta)]',
            )}
          >
            {delta}
          </p>
        )}
      </div>
      {icon !== undefined && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--paper-2)]">
          {icon}
        </div>
      )}
    </div>
  </div>
);

StatCard.displayName = 'StatCard';

export { StatCard };
