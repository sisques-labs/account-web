import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const skeletonVariants = cva(
  'bg-gradient-to-r from-[var(--paper-2)] via-[var(--paper-3)] to-[var(--paper-2)] bg-[length:200%_100%] animate-shimmer',
  {
    variants: {
      variant: {
        line: 'h-4 w-full rounded',
        circle: 'rounded-full',
        block: 'rounded',
      },
    },
    defaultVariants: {
      variant: 'block',
    },
  },
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  ref?: React.Ref<HTMLDivElement>;
  width?: string | number;
  height?: string | number;
}

const Skeleton = ({ className, variant, width, height, style, ref, ...props }: SkeletonProps) => {
  const dimensionStyle: React.CSSProperties = {
    ...(width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height !== undefined ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
    ...style,
  };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(skeletonVariants({ variant }), className)}
      style={dimensionStyle}
      {...props}
    />
  );
};

Skeleton.displayName = 'Skeleton';

export { Skeleton };
