import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> };

const Input = ({ className, type, ref, ...props }: InputProps) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-md border border-[var(--rule)] bg-[var(--paper-2)] px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--ink-3)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--forest-2)] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
};

Input.displayName = 'Input';

export { Input };
