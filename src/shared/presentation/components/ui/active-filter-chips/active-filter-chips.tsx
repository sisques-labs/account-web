import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface ActiveFilter {
  key: string;
  label: string;
}

export interface ActiveFilterChipsProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  filters: ActiveFilter[];
  onRemove: (key: string) => void;
}

const ActiveFilterChips = ({ className, filters, onRemove, ref, ...props }: ActiveFilterChipsProps) => {
  if (filters.length === 0) return null;

  return (
    <div ref={ref} className={cn('flex flex-wrap gap-2', className)} {...props}>
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="chip inline-flex items-center gap-1"
        >
          {filter.label}
          <button
            type="button"
            aria-label={`Remove ${filter.label}`}
            onClick={() => onRemove(filter.key)}
            className="rounded hover:text-[var(--ink)] flex items-center"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  );
};

ActiveFilterChips.displayName = 'ActiveFilterChips';

export { ActiveFilterChips };
