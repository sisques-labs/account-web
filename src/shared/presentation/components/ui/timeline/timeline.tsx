import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description?: string;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  ref?: React.Ref<HTMLOListElement>;
  events: TimelineEvent[];
}

const Timeline = ({ className, events, ref, ...props }: TimelineProps) => (
  <ol ref={ref} className={cn('flex flex-col gap-0', className)} {...props}>
    {events.map((event, i) => (
      <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
        {/* Connector line */}
        {i < events.length - 1 && (
          <div className="absolute left-[7px] top-4 h-full w-0.5 bg-[var(--rule)]" />
        )}
        {/* Dot */}
        <div className="mt-1 flex-shrink-0">
          <div className="h-4 w-4 rounded-full border-2 border-[var(--forest)] bg-[var(--paper)]" />
        </div>
        {/* Content */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <time className="text-xs text-[var(--ink-3)]">{event.timestamp}</time>
          <p className="text-sm font-medium text-[var(--ink)]">{event.title}</p>
          {event.description && (
            <p data-description className="text-xs text-[var(--ink-3)]">
              {event.description}
            </p>
          )}
        </div>
      </li>
    ))}
  </ol>
);

Timeline.displayName = 'Timeline';

export { Timeline };
