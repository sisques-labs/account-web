import * as React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface EventCardProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  title: string;
  time: string;
  location?: string;
  accent?: string;
}

const EventCard = ({ className, title, time, location, accent, ref, ...props }: EventCardProps) => (
  <div
    ref={ref}
    data-accent
    className={cn('card p-3 flex flex-col gap-1', className)}
    style={accent ? { borderLeftColor: accent, borderLeftWidth: '3px' } : undefined}
    {...props}
  >
    <p className="headline text-sm">{title}</p>
    <div className="flex items-center gap-1 text-xs text-[var(--ink-3)]">
      <Clock className="h-3 w-3" />
      <span>{time}</span>
    </div>
    {location && (
      <div data-location className="flex items-center gap-1 text-xs text-[var(--ink-3)]">
        <MapPin className="h-3 w-3" />
        <span>{location}</span>
      </div>
    )}
  </div>
);

EventCard.displayName = 'EventCard';

export { EventCard };
