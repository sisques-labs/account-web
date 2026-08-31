'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getMonthGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export interface CalendarMonthProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  year: number;
  month: number;
  onDateClick?: (isoDate: string) => void;
}

const CalendarMonth = ({ className, year, month, onDateClick, ref, ...props }: CalendarMonthProps) => {
  const today = new Date();
  const cells = getMonthGrid(year, month);

  return (
    <div ref={ref} className={cn('select-none', className)} {...props}>
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map((d) => (
          <span
            key={d}
            data-day-header
            className="text-center text-xs font-medium text-[var(--ink-3)] py-1"
          >
            {d}
          </span>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) =>
          day === null ? (
            <span key={`blank-${i}`} />
          ) : (
            <button
              key={day}
              type="button"
              data-day-cell
              onClick={() => onDateClick?.(toISO(year, month, day))}
              className={cn(
                'h-8 w-8 mx-auto text-sm rounded hover:bg-[var(--paper-2)] transition-colors',
                toISO(year, month, day) === toISO(today.getFullYear(), today.getMonth() + 1, today.getDate()) &&
                  'font-bold text-[var(--forest)]',
              )}
            >
              {day}
            </button>
          ),
        )}
      </div>
    </div>
  );
};

CalendarMonth.displayName = 'CalendarMonth';

export { CalendarMonth };
