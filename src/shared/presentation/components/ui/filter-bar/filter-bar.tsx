'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { SearchInput } from '../search-input/search-input';
import { Switch } from '../switch/switch';
import { Button } from '../button/button';
import { ActiveFilterChips, type ActiveFilter } from '../active-filter-chips/active-filter-chips';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../dropdown-menu/dropdown-menu';

export interface FilterOption {
  value: string;
  label: string;
}

/**
 * One control in a `FilterBar`. A discriminated union so new control kinds
 * (e.g. a date range) can be added later without breaking existing callers.
 * `select` is always multi-capable (`selected: string[]`) — a screen that
 * wants single-select behavior just clears the rest of `selected` in its own
 * `onToggle` handler.
 */
export type FilterDescriptor =
  | {
      type: 'search';
      key: string;
      placeholder: string;
      value: string;
      onChange: (value: string) => void;
    }
  | {
      type: 'select';
      key: string;
      allLabel: string;
      selectedSuffix: string;
      options: FilterOption[];
      selected: string[];
      onToggle: (value: string) => void;
    }
  | {
      type: 'toggle';
      key: string;
      label: string;
      checked: boolean;
      onChange: () => void;
    };

export interface FilterBarProps {
  ref?: React.Ref<HTMLDivElement>;
  filters: FilterDescriptor[];
  chips?: ActiveFilter[];
  onRemoveChip?: (key: string) => void;
  className?: string;
}

const EMPTY_CHIPS: ActiveFilter[] = [];

function selectTriggerLabel(filter: Extract<FilterDescriptor, { type: 'select' }>): string {
  if (filter.selected.length === 0) return filter.allLabel;
  if (filter.selected.length === 1) {
    return filter.options.find((option) => option.value === filter.selected[0])?.label ?? filter.allLabel;
  }
  return `${filter.selected.length} ${filter.selectedSuffix}`;
}

const FilterBar = ({ filters, chips = EMPTY_CHIPS, onRemoveChip, className, ref }: FilterBarProps) => (
  <div ref={ref} className={cn('flex flex-col gap-3', className)}>
    <div className="flex flex-wrap items-center gap-4">
      {filters.map((filter) => {
        if (filter.type === 'search') {
          return (
            <SearchInput
              key={filter.key}
              placeholder={filter.placeholder}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              onClear={() => filter.onChange('')}
              className="w-64"
            />
          );
        }

        if (filter.type === 'select') {
          return (
            <DropdownMenu key={filter.key}>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="w-48 justify-between font-normal">
                  {selectTriggerLabel(filter)}
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {filter.options.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={filter.selected.includes(option.value)}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={() => filter.onToggle(option.value)}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <label key={filter.key} className="flex items-center gap-2 text-sm text-ink-2">
            <Switch checked={filter.checked} onCheckedChange={filter.onChange} />
            {filter.label}
          </label>
        );
      })}
    </div>

    <ActiveFilterChips filters={chips} onRemove={(key) => onRemoveChip?.(key)} />
  </div>
);

FilterBar.displayName = 'FilterBar';

export { FilterBar };
