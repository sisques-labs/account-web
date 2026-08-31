'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/shared/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;
const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = ({ ref, className, sideOffset = 4, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & { ref?: React.Ref<React.ElementRef<typeof TooltipPrimitive.Content>> }) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'card z-50 overflow-hidden px-3 py-1.5 text-xs text-[var(--ink)] shadow-md',
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
);

export interface TooltipProps {
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactElement;
  className?: string;
  contentClassName?: string;
}

const Tooltip = ({ content, side = 'top', children, contentClassName }: TooltipProps) => (
  <TooltipProvider>
    <TooltipRoot>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} className={contentClassName}>
        {content}
      </TooltipContent>
    </TooltipRoot>
  </TooltipProvider>
);

Tooltip.displayName = 'Tooltip';
TooltipContent.displayName = 'TooltipContent';

export { Tooltip, TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent };
