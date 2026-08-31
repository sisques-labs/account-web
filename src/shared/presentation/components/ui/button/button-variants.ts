import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--forest-2)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'rounded-full bg-[var(--forest)] text-[var(--white)] hover:opacity-90 active:scale-95 transition-all',
        destructive:
          'rounded-full bg-[var(--terracotta)] text-[var(--white)] hover:opacity-90 transition-opacity',
        outline:
          'rounded-full border border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--paper-2)] transition-colors',
        secondary:
          'rounded-full bg-[var(--paper-2)] text-[var(--ink)] border border-[var(--rule)] hover:bg-[var(--paper-3)] transition-colors',
        ghost:
          'rounded-full text-[var(--ink-3)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)] transition-colors',
        link:
          'text-[var(--forest)] underline underline-offset-2 decoration-dotted hover:opacity-80 transition-opacity',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8',
        icon: 'h-9 w-9 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
