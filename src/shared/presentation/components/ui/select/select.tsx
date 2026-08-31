'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = ({ className, children, ref, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & { ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Trigger>> }) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-[var(--rule)] bg-[var(--paper-2)] px-3 py-2 text-sm shadow-sm placeholder:text-[var(--ink-3)] focus:outline-none focus:ring-1 focus:ring-[var(--forest-2)] disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);

const SelectScrollUpButton = ({ className, ref, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton> & { ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.ScrollUpButton>> }) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
);

const SelectScrollDownButton = ({ className, ref, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton> & { ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.ScrollDownButton>> }) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
);

const SelectContent = ({ className, children, position = 'popper', ref, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & { ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Content>> }) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

const SelectLabel = ({ className, ref, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> & { ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Label>> }) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold', className)}
    {...props}
  />
);

const SelectItem = ({ className, children, ref, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & { ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Item>> }) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-[var(--paper-2)] focus:text-[var(--ink)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);

const SelectSeparator = ({ className, ref, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> & { ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Separator>> }) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-[var(--rule)]', className)}
    {...props}
  />
);

SelectTrigger.displayName = 'SelectTrigger';
SelectContent.displayName = 'SelectContent';
SelectLabel.displayName = 'SelectLabel';
SelectItem.displayName = 'SelectItem';
SelectSeparator.displayName = 'SelectSeparator';
SelectScrollUpButton.displayName = 'SelectScrollUpButton';
SelectScrollDownButton.displayName = 'SelectScrollDownButton';

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
