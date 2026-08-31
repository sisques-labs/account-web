import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const PALETTE = ['forest', 'honey', 'terra', 'sage', 'plum', 'sky'] as const;

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  return h % PALETTE.length;
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

const avatarVariants = cva(
  'inline-flex items-center justify-center rounded-full font-semibold select-none',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface InitialsAvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {
  ref?: React.Ref<HTMLSpanElement>;
  name: string;
}

const InitialsAvatar = ({ className, name, size, ref, ...props }: InitialsAvatarProps) => {
  const colorKey = PALETTE[hashName(name)];
  const colorStyle =
    colorKey === 'plum' || colorKey === 'sky'
      ? { backgroundColor: `var(--${colorKey}-bg, var(--paper-2))`, color: `var(--${colorKey}, var(--ink))` }
      : { backgroundColor: `var(--${colorKey}-bg)`, color: `var(--${colorKey})` };

  return (
    <span
      ref={ref}
      className={cn(avatarVariants({ size }), className)}
      style={colorStyle}
      aria-label={name}
      {...props}
    >
      {getInitials(name)}
    </span>
  );
};

InitialsAvatar.displayName = 'InitialsAvatar';

export { InitialsAvatar };
