import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const blockquoteVariants = cva('border-l-4 pl-4', {
  variants: {
    variant: {
      pullquote: 'border-[var(--forest)] text-lg italic text-[var(--ink)] font-[var(--font-serif,serif)]',
      'diary-note': 'border-[var(--honey)] text-base text-[var(--ink-2)] font-[var(--font-hand,cursive)]',
      'stat-highlight': 'border-[var(--forest-2)] text-4xl font-bold text-[var(--ink)] tabular-nums',
    },
  },
  defaultVariants: {
    variant: 'pullquote',
  },
});

export interface BlockquoteProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'cite'>,
    VariantProps<typeof blockquoteVariants> {
  ref?: React.Ref<HTMLQuoteElement>;
  cite?: string;
  children: React.ReactNode;
}

const Blockquote = ({ className, variant, cite, children, ref, ...props }: BlockquoteProps) => (
  <blockquote ref={ref} className={cn(blockquoteVariants({ variant }), className)} {...props}>
    {children}
    {cite && (
      <footer className="mt-1 text-sm text-[var(--ink-3)]">
        <cite>{cite}</cite>
      </footer>
    )}
  </blockquote>
);

Blockquote.displayName = 'Blockquote';

export { Blockquote };
