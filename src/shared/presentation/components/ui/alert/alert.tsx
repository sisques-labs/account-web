import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const alertVariants = cva(
  'relative flex w-full items-start gap-3 rounded-md border p-4 text-sm',
  {
    variants: {
      variant: {
        info: 'bg-[var(--forest-bg)] border-[var(--forest-2)] text-[var(--forest)] [&>svg]:text-[var(--forest)]',
        warning:
          'bg-[var(--honey-bg)] border-[var(--honey)] text-[var(--ink)] [&>svg]:text-[var(--honey-2)]',
        error:
          'bg-destructive/10 border-destructive/30 text-destructive [&>svg]:text-destructive',
        success:
          'bg-[var(--forest-bg)] border-[var(--forest-3)] text-[var(--forest)] [&>svg]:text-[var(--forest-2)]',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

const VARIANT_ICONS = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle2,
} as const;

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  ref?: React.Ref<HTMLDivElement>;
  variant: 'info' | 'warning' | 'error' | 'success';
  message: string;
  title?: string;
}

const Alert = ({ className, variant = 'info', message, title, ref, ...props }: AlertProps) => {
  const Icon = VARIANT_ICONS[variant ?? 'info'];
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        {title && <p className="font-medium leading-none">{title}</p>}
        <p>{message}</p>
      </div>
    </div>
  );
};

Alert.displayName = 'Alert';

export { Alert };
