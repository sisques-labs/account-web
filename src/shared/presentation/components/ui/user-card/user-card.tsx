import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import { InitialsAvatar } from '../initials-avatar/initials-avatar';

const userCardVariants = cva('flex items-center gap-3', {
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    size: 'md',
  },
});

export interface UserCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof userCardVariants> {
  ref?: React.Ref<HTMLDivElement>;
  name: string;
  secondary?: string;
}

const UserCard = ({ ref, className, name, secondary, orientation, size, ...props }: UserCardProps) => (
  <div ref={ref} className={cn(userCardVariants({ orientation, size }), className)} {...props}>
    <InitialsAvatar name={name} size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'} />
    <div className="flex flex-col min-w-0">
      <span className="text-sm font-medium text-[var(--ink)] truncate">{name}</span>
      {secondary && (
        <span data-secondary className="text-xs text-[var(--ink-3)] truncate">
          {secondary}
        </span>
      )}
    </div>
  </div>
);

UserCard.displayName = 'UserCard';

export { UserCard };
