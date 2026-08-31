'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getMonthGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  ref?: React.Ref<HTMLDivElement>;
  value?: string;
  onChange?: (isoDate: string) => void;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
}

const DatePicker = ({ className, value, onChange, minDate, maxDate, placeholder = 'Select date', ref, ...props }: DatePickerProps) => {
  const today = new Date();
  const [open, setOpen] = React.useState(false);
  const [viewYear, setViewYear] = React.useState(today.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(today.getMonth() + 1);
  const [inputVal, setInputVal] = React.useState(value ?? '');

  const cells = getMonthGrid(viewYear, viewMonth);

  const isDisabled = (day: number): boolean => {
    const iso = toISO(viewYear, viewMonth, day);
    if (minDate && iso < minDate) return true;
    if (maxDate && iso > maxDate) return true;
    return false;
  };

  const handleDayClick = (day: number) => {
    const iso = toISO(viewYear, viewMonth, day);
    setInputVal(iso);
    onChange?.(iso);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 1) { setViewYear((y) => y - 1); setViewMonth(12); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 12) { setViewYear((y) => y + 1); setViewMonth(1); }
    else setViewMonth((m) => m + 1);
  };

  return (
    <div ref={ref} className={cn('relative inline-block', className)} onKeyDown={handleKeyDown} {...props}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={inputVal}
          readOnly
          placeholder={placeholder}
          onClick={() => setOpen((o) => !o)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="flex h-9 w-full rounded-md border border-[var(--rule)] bg-[var(--paper-2)] px-3 py-1 pr-9 text-sm shadow-sm outline-none placeholder:text-[var(--ink-3)] cursor-pointer focus:ring-1 focus:ring-[var(--forest-2)]"
        />
        <CalendarIcon className="absolute right-3 h-4 w-4 text-[var(--ink-3)] pointer-events-none" />
      </div>

      {open && (
        <div className="card absolute z-50 mt-1 p-3 min-w-[260px]">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={prevMonth} aria-label="Previous month" className="p-1 hover:bg-[var(--paper-2)] rounded">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium">
              {MONTHS[viewMonth - 1]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth} aria-label="Next month" className="p-1 hover:bg-[var(--paper-2)] rounded">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day headers */}
          <div role="grid" aria-label="Calendar">
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map((d) => (
                <span key={d} className="text-center text-xs font-medium text-[var(--ink-3)] py-1">{d}</span>
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
                    data-day={day}
                    disabled={isDisabled(day)}
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      'h-8 w-8 text-sm rounded hover:bg-[var(--paper-2)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed',
                      toISO(viewYear, viewMonth, day) === (value ?? inputVal) && 'bg-[var(--forest)] text-white',
                    )}
                  >
                    {day}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

DatePicker.displayName = 'DatePicker';

export { DatePicker };
