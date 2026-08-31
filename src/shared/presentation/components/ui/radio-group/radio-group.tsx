'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const RadioGroup = ({ className, ref, ...props }: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & { ref?: React.Ref<React.ElementRef<typeof RadioGroupPrimitive.Root>> }) => (
  <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />
);

const RadioGroupItem = ({ className, ref, ...props }: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & { ref?: React.Ref<React.ElementRef<typeof RadioGroupPrimitive.Item>> }) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'aspect-square h-4 w-4 rounded-full border border-[var(--rule)] text-[var(--forest)] shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--forest-2)] disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <Circle className="h-3.5 w-3.5 fill-[var(--forest)]" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
);

RadioGroup.displayName = 'RadioGroup';
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
