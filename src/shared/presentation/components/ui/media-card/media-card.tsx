import * as React from 'react';
import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const mediaCardVariants = cva('card overflow-hidden flex', {
  variants: {
    variant: {
      vertical: 'flex-col',
      horizontal: 'flex-row',
    },
  },
  defaultVariants: {
    variant: 'vertical',
  },
});

export interface MediaCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mediaCardVariants> {
  ref?: React.Ref<HTMLDivElement>;
  src: string;
  alt: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const MediaCard = ({ ref, className, src, alt, title, description, variant, actions, ...props }: MediaCardProps) => (
  <div ref={ref} className={cn(mediaCardVariants({ variant }), className)} {...props}>
    <div
      className={cn(
        'relative',
        variant === 'horizontal' ? 'w-32 h-full shrink-0' : 'w-full h-40',
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes={variant === 'horizontal' ? '128px' : '100vw'}
        className="object-cover"
      />
    </div>
    <div className="flex flex-col gap-1 p-3">
      <h4 className="headline text-sm">{title}</h4>
      {description && <p className="text-xs text-[var(--ink-3)]">{description}</p>}
      {actions && <div className="mt-1">{actions}</div>}
    </div>
  </div>
);

MediaCard.displayName = 'MediaCard';

export { MediaCard };
