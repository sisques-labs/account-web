'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const Checkbox = ({ className, ref, ...props }: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & { ref?: React.Ref<React.ElementRef<typeof CheckboxPrimitive.Root>> }) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-[var(--rule)] shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--forest-2)] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--forest)] data-[state=checked]:border-[var(--forest)] data-[state=checked]:text-[var(--white)]',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
