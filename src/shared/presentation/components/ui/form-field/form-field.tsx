import { Children, cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface FormFieldProps {
  label: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, error, children, className }: FormFieldProps) {
  const generatedId = useId();
  const child = Children.only(children);
  const controlId = isValidElement(child) ? ((child.props as { id?: string }).id ?? generatedId) : generatedId;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={controlId} className="text-sm font-medium text-[var(--ink)]">
        {label}
      </label>
      {isValidElement(child)
        ? cloneElement(child as ReactElement<{ id?: string }>, { id: controlId })
        : child}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
FormField.displayName = 'FormField';
