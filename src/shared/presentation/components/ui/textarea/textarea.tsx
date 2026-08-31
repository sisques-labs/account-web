import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: React.Ref<HTMLTextAreaElement> };

const Textarea = ({ className, ref, ...props }: TextareaProps) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[60px] w-full rounded-md border border-[var(--rule)] bg-[var(--paper-2)] px-3 py-2 text-sm shadow-sm placeholder:text-[var(--ink-3)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--forest-2)] disabled:cursor-not-allowed disabled:opacity-50 resize-none',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
};

Textarea.displayName = 'Textarea';

export { Textarea };
