'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

type TabsVariant = 'line' | 'pill';

const TabsVariantContext = React.createContext<TabsVariant>('line');

const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      line: 'line border-b border-[var(--rule)]',
      pill: 'pill rounded-lg bg-[var(--paper-2)] p-1',
    },
  },
  defaultVariants: {
    variant: 'line',
  },
});

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {
  ref?: React.Ref<React.ElementRef<typeof TabsPrimitive.List>>;
}

const TabsList = ({ className, variant = 'line', children, ref, ...props }: TabsListProps) => (
  <TabsVariantContext.Provider value={variant ?? 'line'}>
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    >
      {children}
    </TabsPrimitive.List>
  </TabsVariantContext.Provider>
);

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        line: 'border-b-2 border-transparent text-[var(--ink-3)] data-[state=active]:border-[var(--forest)] data-[state=active]:text-[var(--forest)]',
        pill: 'rounded-sm text-[var(--ink-2)] data-[state=active]:bg-[var(--paper)] data-[state=active]:text-[var(--ink)] data-[state=active]:shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'line',
    },
  },
);

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {
  ref?: React.Ref<React.ElementRef<typeof TabsPrimitive.Trigger>>;
}

const TabsTrigger = ({ className, variant, ref, ...props }: TabsTriggerProps) => {
  const contextVariant = React.useContext(TabsVariantContext);
  const resolvedVariant = variant ?? contextVariant;
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(tabsTriggerVariants({ variant: resolvedVariant }), className)}
      {...props}
    />
  );
};

const TabsContent = ({ className, ref, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & { ref?: React.Ref<React.ElementRef<typeof TabsPrimitive.Content>> }) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
);

TabsList.displayName = 'TabsList';
TabsTrigger.displayName = 'TabsTrigger';
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
