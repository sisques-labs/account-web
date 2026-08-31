import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface HealthDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  value: number;
  max?: number;
}

const HealthDots = ({ ref, className, value, max = 5, ...props }: HealthDotsProps) => (
  <div ref={ref} className={cn('flex items-center gap-1', className)} {...props}>
    {Array.from({ length: max }, (_, i) => {
      const isFilled = i < value;
      return (
        <span
          key={i}
          data-dot
          data-filled={isFilled ? 'true' : 'false'}
          className={cn(
            'inline-block h-2.5 w-2.5 rounded-full',
            isFilled ? 'dot-good' : 'dot',
          )}
        />
      );
    })}
  </div>
);

HealthDots.displayName = 'HealthDots';

export { HealthDots };
