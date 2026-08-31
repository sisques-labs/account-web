import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { InitialsAvatar } from '../initials-avatar/initials-avatar';
import { NumericBadge } from '../numeric-badge/numeric-badge';

export interface AvatarGroupItem {
  name: string;
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  items: AvatarGroupItem[];
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const AvatarGroup = ({ className, items, max = 4, size = 'md', ref, ...props }: AvatarGroupProps) => {
  const visible = items.slice(0, max);
  const overflow = items.length - max;

  return (
    <div ref={ref} className={cn('flex items-center', className)} {...props}>
      {visible.map((item, i) => (
        <InitialsAvatar
          key={item.name}
          name={item.name}
          size={size}
          className={i > 0 ? '-ml-2' : undefined}
        />
      ))}
      {overflow > 0 && (
        <span className="-ml-2 inline-flex items-center justify-center rounded-full bg-[var(--paper-2)] border border-[var(--paper)] px-1.5 py-0.5 text-xs font-semibold z-10 h-10 w-10">
          +{overflow}
        </span>
      )}
    </div>
  );
};

AvatarGroup.displayName = 'AvatarGroup';

export { AvatarGroup };
