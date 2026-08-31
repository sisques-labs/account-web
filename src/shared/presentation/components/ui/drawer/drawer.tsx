'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const drawerContentVariants = cva(
  'fixed z-50 flex flex-col bg-[var(--paper)] shadow-xl transition-transform duration-300',
  {
    variants: {
      side: {
        right: 'inset-y-0 right-0 h-full w-80 data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full',
        left: 'inset-y-0 left-0 h-full w-80 data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full',
        bottom: 'inset-x-0 bottom-0 w-full max-h-[80vh] data-[state=open]:translate-y-0 data-[state=closed]:translate-y-full',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
);

export interface DrawerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerContentVariants> {
  ref?: React.Ref<HTMLDivElement>;
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Drawer = ({ className, open, onClose, side = 'right', title, children, ref, ...props }: DrawerProps) => (
  <DialogPrimitive.Root open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
      <DialogPrimitive.Content
        ref={ref}
        data-side={side}
        className={cn(drawerContentVariants({ side }), className)}
        {...props}
      >
        <div className="flex items-center justify-between border-b border-[var(--rule)] px-4 py-3">
          <DialogPrimitive.Title className="eyebrow">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Close
            onClick={onClose}
            className="rounded p-1 hover:bg-[var(--paper-2)] transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </div>
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
);

Drawer.displayName = 'Drawer';

export { Drawer };
