'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/shared/lib/utils';

const PopoverRoot = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = ({ className, align = 'start', sideOffset = 4, ref, ...props }: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & { ref?: React.Ref<React.ElementRef<typeof PopoverPrimitive.Content>> }) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'card z-50 min-w-[8rem] p-4 shadow-lg outline-none',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
);

export interface PopoverProps {
  trigger: React.ReactElement;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  contentClassName?: string;
}

const Popover = ({ trigger, children, open, onOpenChange, contentClassName }: PopoverProps) => (
  <PopoverRoot open={open} onOpenChange={onOpenChange}>
    <PopoverTrigger asChild>{trigger}</PopoverTrigger>
    <PopoverContent className={contentClassName}>{children}</PopoverContent>
  </PopoverRoot>
);

Popover.displayName = 'Popover';
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverRoot, PopoverTrigger, PopoverContent };
