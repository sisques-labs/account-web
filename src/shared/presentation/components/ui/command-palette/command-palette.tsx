'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import { cn } from '@/shared/lib/utils';

export interface CommandItem {
  id: string;
  label: string;
  group: string;
  action: () => void;
  icon?: React.ReactNode;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: CommandItem[];
  placeholder?: string;
  shortcut?: boolean;
  className?: string;
}

const CommandPalette = ({
  open,
  onClose,
  commands,
  placeholder = 'Search...',
  shortcut = false,
  className,
}: CommandPaletteProps) => {
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    if (!shortcut) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // shortcut mode: consumer controls open state externally
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [shortcut]);

  // Group commands by group field
  const grouped = React.useMemo(() => {
    const filtered = commands.filter((cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase()),
    );
    const map = new Map<string, CommandItem[]>();
    for (const cmd of filtered) {
      const list = map.get(cmd.group) ?? [];
      list.push(cmd);
      map.set(cmd.group, list);
    }
    return map;
  }, [commands, query]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-1/2 top-1/4 z-50 w-full max-w-lg -translate-x-1/2 rounded-xl bg-[var(--paper)] shadow-xl',
            className,
          )}
          aria-label="Command palette"
        >
          <DialogPrimitive.Title className="sr-only">Command palette</DialogPrimitive.Title>
          <Command shouldFilter={false}>
            <Command.Input
              role="combobox"
              placeholder={placeholder}
              value={query}
              onValueChange={setQuery}
              className="w-full border-b border-[var(--rule)] bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[var(--ink-3)]"
            />
            <Command.List className="max-h-72 overflow-y-auto p-2">
              {[...grouped.entries()].map(([group, items]) => (
                <Command.Group
                  key={group}
                  heading={
                    <span className="eyebrow px-2 py-1">
                      {group}
                    </span>
                  }
                >
                  {items.map((item) => (
                    <Command.Item
                      key={item.id}
                      onSelect={() => {
                        item.action();
                        onClose();
                      }}
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-[var(--paper-2)] aria-selected:bg-[var(--paper-2)]"
                    >
                      {item.icon && <span className="h-4 w-4">{item.icon}</span>}
                      {item.label}
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
              {grouped.size === 0 && (
                <Command.Empty className="py-6 text-center text-sm text-[var(--ink-2)]">
                  No results found.
                </Command.Empty>
              )}
            </Command.List>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
CommandPalette.displayName = 'CommandPalette';

export { CommandPalette };
