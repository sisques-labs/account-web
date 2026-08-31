import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Input } from '../input/input';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
  onClear?: () => void;
}

const SearchInput = ({ ref, className, onClear, value, ...props }: SearchInputProps) => (
  <div className={cn('relative flex items-center', className)}>
    <Search className="absolute left-3 h-4 w-4 text-[var(--ink-3)] pointer-events-none" />
    <Input
      ref={ref}
      value={value}
      className="pl-9 pr-8"
      {...props}
    />
    {value && onClear && (
      <button
        type="button"
        aria-label="Clear search"
        onClick={onClear}
        className="absolute right-2 h-5 w-5 flex items-center justify-center text-[var(--ink-3)] hover:text-[var(--ink)] rounded"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    )}
  </div>
);

SearchInput.displayName = 'SearchInput';

export { SearchInput };
