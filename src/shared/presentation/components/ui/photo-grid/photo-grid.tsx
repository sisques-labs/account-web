import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

export interface PhotoGridPhoto {
  src: string;
  alt: string;
}

export interface PhotoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  photos: PhotoGridPhoto[];
  columns?: number;
  onPhotoClick?: (index: number) => void;
}

const PhotoGrid = ({ className, photos, columns = 3, onPhotoClick, ref, ...props }: PhotoGridProps) => (
  <div
    ref={ref}
    className={cn('grid gap-2', className)}
    style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    {...props}
  >
    {photos.map((photo, i) => (
      <button
        key={photo.src}
        type="button"
        onClick={() => onPhotoClick?.(i)}
        className="relative overflow-hidden rounded aspect-square btn-reset"
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          unoptimized
          sizes={`${Math.round(100 / columns)}vw`}
          className="object-cover transition-transform hover:scale-105"
        />
      </button>
    ))}
  </div>
);

PhotoGrid.displayName = 'PhotoGrid';

export { PhotoGrid };
