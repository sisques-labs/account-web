'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  items: AccordionItem[];
  mode?: 'single' | 'multiple';
  defaultOpen?: string[];
}

const Accordion = ({ className, items, mode = 'single', defaultOpen = [], ref, ...props }: AccordionProps) => {
  const [openItems, setOpenItems] = React.useState<string[]>(defaultOpen);

  const toggle = (id: string) => {
    setOpenItems((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (mode === 'single') return [id];
      return [...prev, id];
    });
  };

  const openSet = React.useMemo(() => new Set(openItems), [openItems]);

  return (
    <div ref={ref} className={cn('flex flex-col divide-y divide-[var(--rule)]', className)} {...props}>
      {items.map((item) => {
        const isOpen = openSet.has(item.id);
        const triggerId = `accordion-trigger-${item.id}`;
        const contentId = `accordion-content-${item.id}`;

        return (
          <div key={item.id}>
            <button
              id={triggerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={contentId}
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between py-3 text-sm font-medium text-[var(--ink)] hover:text-[var(--forest)] transition-colors"
            >
              {item.title}
              <ChevronDown
                className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
              />
            </button>
            {isOpen && (
              <div
                id={contentId}
                role="region"
                aria-labelledby={triggerId}
                className="pb-3 text-sm text-[var(--ink-2)]"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

Accordion.displayName = 'Accordion';

export { Accordion };
