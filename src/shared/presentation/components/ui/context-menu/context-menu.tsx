'use client';

import * as React from 'react';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { cn } from '@/shared/lib/utils';

export interface ContextMenuItem {
  label: string;
  action: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ContextMenuProps {
  items: ContextMenuItem[];
  children: React.ReactElement;
  className?: string;
  contentClassName?: string;
}

const ContextMenuContent = ({ className, ref, ...props }: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content> & { ref?: React.Ref<React.ElementRef<typeof ContextMenuPrimitive.Content>> }) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        'card z-50 min-w-[8rem] overflow-hidden p-1 text-sm shadow-lg',
        className,
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
);

const ContextMenu = ({ items, children, contentClassName }: ContextMenuProps) => (
  <ContextMenuPrimitive.Root>
    <ContextMenuPrimitive.Trigger asChild>{children}</ContextMenuPrimitive.Trigger>
    <ContextMenuContent className={contentClassName}>
      {items.map((item) => (
        <ContextMenuPrimitive.Item
          key={item.label}
          disabled={item.disabled}
          onSelect={item.action}
          className="flex items-center gap-2 rounded px-2 py-1.5 cursor-pointer hover:bg-[var(--paper-2)] outline-none aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
        >
          {item.icon && <span className="h-4 w-4">{item.icon}</span>}
          {item.label}
        </ContextMenuPrimitive.Item>
      ))}
    </ContextMenuContent>
  </ContextMenuPrimitive.Root>
);

ContextMenu.displayName = 'ContextMenu';

export { ContextMenu };
