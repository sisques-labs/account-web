'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

const ICON_BADGE_VARIANT_CLASS = {
  forest: 'bg-[var(--forest-bg)] text-[var(--forest)]',
  honey: 'bg-[var(--honey-bg)] text-[var(--honey-2)]',
  terra: 'bg-[var(--terra-bg)] text-[var(--terracotta)]',
  sage: 'bg-[var(--sage-bg)] text-[var(--forest)]',
  plum: 'bg-[var(--plum-bg)] text-[var(--plum)]',
  sky: 'bg-[var(--sky-bg)] text-[var(--sky)]',
} as const;

export type EntityRowIconVariant = keyof typeof ICON_BADGE_VARIANT_CLASS;

type EntityRowProps = {
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  /** Leading icon rendered inside a colored circular badge. */
  icon?: ReactNode;
  iconVariant?: EntityRowIconVariant;
  /** When provided, renders a checklist checkbox that fires this on click. Omit when there's nothing to complete. */
  onComplete?: () => void;
  /** Accessible label for the complete checkbox. */
  completeLabel?: string;
  /** Renders a terracotta left accent border to flag an overdue item. */
  overdue?: boolean;
};

function EntityRow({
  children,
  actions,
  className,
  icon,
  iconVariant = 'forest',
  onComplete,
  completeLabel,
  overdue = false,
}: EntityRowProps) {
  const [checked, setChecked] = useState(false);

  function handleComplete() {
    setChecked(true);
    onComplete?.();
  }

  return (
    <div
      className={cn(
        'w-full rounded-lg border bg-[var(--paper)] p-4',
        overdue ? 'border-l-4 border-l-[var(--terracotta)]' : undefined,
        className,
      )}
    >
      <div data-testid="entity-row-layout" className="flex items-center justify-between gap-3">
        <div data-testid="entity-row-leading" className="flex min-w-0 flex-1 items-center gap-3">
          {onComplete && (
            <button
              type="button"
              aria-label={completeLabel}
              disabled={checked}
              onClick={handleComplete}
              className={cn('cbox shrink-0 transition-colors duration-200', checked && 'done')}
            />
          )}
          {icon && (
            <span
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                ICON_BADGE_VARIANT_CLASS[iconVariant],
              )}
            >
              {icon}
            </span>
          )}
          <div className="min-w-0 flex-1">{children}</div>
        </div>
        {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
      </div>
    </div>
  );
}
EntityRow.displayName = 'EntityRow';

type EntityRowActionVariant = 'default' | 'destructive';

const actionVariantClass: Record<EntityRowActionVariant, string> = {
  default: 'text-[var(--ink-3)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]',
  destructive: 'text-destructive hover:bg-[var(--terra-bg)] hover:text-destructive',
};

type EntityRowActionProps = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: EntityRowActionVariant;
};

function EntityRowAction({ icon, label, onClick, variant = 'default' }: EntityRowActionProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors',
        actionVariantClass[variant],
      )}
    >
      {icon}
    </button>
  );
}
EntityRowAction.displayName = 'EntityRowAction';

export { EntityRow, EntityRowAction };
