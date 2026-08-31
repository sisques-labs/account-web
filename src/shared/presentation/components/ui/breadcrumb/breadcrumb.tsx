import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const Breadcrumb = ({ ref, className, ...props }: React.ComponentPropsWithoutRef<'nav'> & { ref?: React.Ref<HTMLElement> }) => (
  <nav ref={ref} aria-label="breadcrumb" className={cn(className)} {...props} />
);

const BreadcrumbList = ({ ref, className, ...props }: React.ComponentPropsWithoutRef<'ol'> & { ref?: React.Ref<HTMLOListElement> }) => (
  <ol
    ref={ref}
    className={cn('flex flex-wrap items-center gap-1.5 text-sm text-[var(--ink-3)]', className)}
    {...props}
  />
);

const BreadcrumbItem = ({ ref, className, ...props }: React.ComponentPropsWithoutRef<'li'> & { ref?: React.Ref<HTMLLIElement> }) => (
  <li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} />
);

const BreadcrumbLink = ({ ref, className, ...props }: React.ComponentPropsWithoutRef<'a'> & { ref?: React.Ref<HTMLAnchorElement> }) => (
  <a
    ref={ref}
    className={cn('transition-colors hover:text-[var(--ink)]', className)}
    {...props}
  />
);

const BreadcrumbPage = ({ ref, className, ...props }: React.ComponentPropsWithoutRef<'span'> & { ref?: React.Ref<HTMLSpanElement> }) => (
  <span
    ref={ref}
    aria-current="page"
    className={cn('font-medium text-[var(--ink)]', className)}
    {...props}
  />
);

const BreadcrumbSeparator = ({ className, ...props }: React.ComponentPropsWithoutRef<'li'>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('text-[var(--ink-3)]', className)}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
  </li>
);

Breadcrumb.displayName = 'Breadcrumb';
BreadcrumbList.displayName = 'BreadcrumbList';
BreadcrumbItem.displayName = 'BreadcrumbItem';
BreadcrumbLink.displayName = 'BreadcrumbLink';
BreadcrumbPage.displayName = 'BreadcrumbPage';
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
