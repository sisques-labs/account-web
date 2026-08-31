import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = ({ className, icon, title, description, action, ref, ...props }: EmptyStateProps) => (
  <div
    ref={ref}
    className={cn('flex flex-col items-center justify-center gap-3 py-12 text-center', className)}
    {...props}
  >
    {icon ? (
      <div className="text-[var(--ink-3)]">{icon}</div>
    ) : (
      <div className="placeholder-img leaf w-20 h-20 rounded-full text-xs" />
    )}
    <h3 className="headline text-xl">{title}</h3>
    {description && (
      <p data-description className="text-sm text-[var(--ink-3)]">
        {description}
      </p>
    )}
    {action && <div>{action}</div>}
  </div>
);

EmptyState.displayName = 'EmptyState';

export { EmptyState };
