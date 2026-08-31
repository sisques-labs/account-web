'use client';

import { Toaster as Sonner } from 'sonner';

const Toaster = () => (
  <Sonner
    position="bottom-right"
    richColors
    theme="system"
    toastOptions={{
      classNames: {
        toast: 'bg-[var(--paper)] text-[var(--ink)] border-[var(--rule)]',
      },
    }}
  />
);

Toaster.displayName = 'Toaster';

export { Toaster };
