'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface StarRatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  ref?: React.Ref<HTMLDivElement>;
  value?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  max?: number;
}

const StarRating = ({ className, value = 0, onChange, readOnly = false, max = 5, ref, ...props }: StarRatingProps) => (
  <div ref={ref} className={cn('flex items-center', className)} {...props}>
    {Array.from({ length: max }, (_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= value;

      if (readOnly) {
        return (
          <span
            key={i}
            data-filled={isFilled ? 'true' : 'false'}
            className={cn('h-5 w-5', isFilled ? 'text-[var(--honey)]' : 'text-[var(--rule)]')}
          >
            <Star
              className="h-5 w-5"
              fill={isFilled ? 'currentColor' : 'none'}
            />
          </span>
        );
      }

      return (
        <button
          key={i}
          type="button"
          aria-label={`Rate ${starValue} star${starValue === 1 ? '' : 's'}`}
          data-filled={isFilled ? 'true' : 'false'}
          onClick={() => onChange?.(starValue)}
          className={cn(
            'h-5 w-5 transition-colors',
            isFilled ? 'text-[var(--honey)]' : 'text-[var(--rule)] hover:text-[var(--honey)]'
          )}
        >
          <Star
            className="h-5 w-5"
            fill={isFilled ? 'currentColor' : 'none'}
          />
        </button>
      );
    })}
  </div>
);

StarRating.displayName = 'StarRating';

export { StarRating };
