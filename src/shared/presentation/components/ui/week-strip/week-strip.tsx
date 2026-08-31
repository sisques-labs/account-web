'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';

const SHORT_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(dateStr: string, days: number): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return date;
}

export interface WeekStripProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  weekStartDate: string;
  activeDate?: string;
  onDateClick?: (isoDate: string) => void;
}

const WeekStrip = ({ className, weekStartDate, activeDate, onDateClick, ref, ...props }: WeekStripProps) => {
  const today = toISO(new Date());
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(weekStartDate, i);
    return { iso: toISO(d), day: d.getDate(), weekday: SHORT_DAYS[d.getDay()] };
  });

  return (
    <div ref={ref} className={cn('flex gap-1', className)} {...props}>
      {days.map(({ iso, day, weekday }) => {
        const isActive = iso === activeDate;
        const isToday = iso === today;

        return (
          <button
            key={iso}
            type="button"
            data-day-cell
            onClick={() => onDateClick?.(iso)}
            className={cn(
              'flex flex-col items-center gap-0.5 rounded p-2 text-sm transition-colors flex-1',
              isActive
                ? 'bg-[var(--forest)] text-[var(--white)]'
                : isToday
                ? 'text-[var(--forest)] font-semibold hover:bg-[var(--paper-2)]'
                : 'text-[var(--ink-2)] hover:bg-[var(--paper-2)]',
            )}
          >
            <span className="text-xs">{weekday}</span>
            <span className="font-medium">{day}</span>
          </button>
        );
      })}
    </div>
  );
};

WeekStrip.displayName = 'WeekStrip';

export { WeekStrip };
