import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import { Chip, type ChipVariant } from '../chip/chip';

export interface PlantCardProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  name: string;
  species?: string;
  status?: string;
  imageUrl?: string;
}

function getStatusVariant(status: string): ChipVariant {
  const s = status.toLowerCase();
  if (s === 'sano' || s === 'healthy' || s === 'good') return 'forest';
  if (s === 'atención' || s === 'atencion' || s === 'attention' || s === 'warning') return 'honey';
  if (s === 'riesgo' || s === 'risk' || s === 'danger' || s === 'critical') return 'terra';
  if (s === 'recuperando' || s === 'recovering') return 'sage';
  return 'default';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

const PlantCard = ({ ref, className, name, species, status, imageUrl, ...props }: PlantCardProps) => (
  <div ref={ref} className={cn('card p-4 flex flex-col gap-2', className)} {...props}>
    {imageUrl ? (
      <div className="relative w-full h-40">
        <Image src={imageUrl} alt={name} fill unoptimized sizes="100vw" className="object-cover rounded" />
      </div>
    ) : (
      <div className="placeholder-img leaf w-full h-40 rounded text-sm font-medium">
        {getInitials(name)}
      </div>
    )}
    <div className="flex flex-col gap-0.5">
      <h3 className="headline text-base">{name}</h3>
      {species && (
        <p className="text-xs italic text-[var(--ink-3)]" style={{ fontFamily: 'var(--font-serif)' }}>
          {species}
        </p>
      )}
    </div>
    {status && <Chip variant={getStatusVariant(status)}>{status}</Chip>}
  </div>
);

PlantCard.displayName = 'PlantCard';

export { PlantCard };
