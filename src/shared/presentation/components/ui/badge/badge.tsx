import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        // Gardenia token variants — map to .chip CSS token classes
        forest: 'chip forest',
        honey: 'chip honey',
        terra: 'chip terra',
        sage: 'chip sage',
        neutral: 'chip',
        outline: 'chip outline',

        // @deprecated — kept for one release backward-compat; remove in next major
        /** @deprecated Use `neutral` instead */
        default: 'chip',
        /** @deprecated Use `sage` instead */
        secondary: 'chip sage',
        /** @deprecated Use `terra` instead */
        destructive: 'chip terra',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

Badge.displayName = 'Badge';

export { Badge };
