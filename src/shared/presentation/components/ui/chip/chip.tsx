import * as React from 'react';
import { cn } from '@/shared/lib/utils';

const CHIP_VARIANT_MAP = {
  default: '',
  forest: 'forest',
  honey: 'honey',
  terra: 'terra',
  sage: 'sage',
  outline: 'outline',
} as const;

export type ChipVariant = keyof typeof CHIP_VARIANT_MAP;

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  ref?: React.Ref<HTMLSpanElement>;
  variant?: ChipVariant;
}

const Chip = ({ className, variant = 'default', children, ref, ...props }: ChipProps) => {
  const variantClass = CHIP_VARIANT_MAP[variant];
  return (
    <span
      ref={ref}
      className={cn('chip', variantClass || undefined, className)}
      {...props}
    >
      {children}
    </span>
  );
};

Chip.displayName = 'Chip';

export { Chip };
