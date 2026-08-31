'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Input } from '../input/input';

export type PasswordInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & { ref?: React.Ref<HTMLInputElement> };

const PasswordInput = ({ className, ref, ...props }: PasswordInputProps) => {
  const [shown, setShown] = React.useState(false);

  return (
    <div className={cn('relative flex items-center', className)}>
      <Input
        ref={ref}
        type={shown ? 'text' : 'password'}
        className="pr-10"
        {...props}
      />
      <button
        type="button"
        aria-label={shown ? 'Hide password' : 'Show password'}
        onClick={() => setShown((s) => !s)}
        className="absolute right-2 flex items-center justify-center h-6 w-6 text-[var(--ink-3)] hover:text-[var(--ink)] rounded"
      >
        {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
};

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
