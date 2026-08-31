'use client';

import * as React from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface PhotoPickerPhoto {
  src: string;
  alt: string;
}

export interface PhotoPickerProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  photos: PhotoPickerPhoto[];
  mode?: 'single' | 'multiple';
  selected?: number[];
  onSelectionChange?: (indexes: number[]) => void;
}

const PhotoPicker = ({ className, photos, mode = 'single', selected, onSelectionChange, ref, ...props }: PhotoPickerProps) => {
  const isControlled = selected !== undefined;
  const [internalSelected, setInternalSelected] = React.useState<number[]>([]);
  const selectedSet = new Set(isControlled ? selected : internalSelected);

  const toggle = (i: number) => {
    let next: number[];
    if (mode === 'single') {
      next = [i];
    } else {
      next = selectedSet.has(i)
        ? (isControlled ? selected! : internalSelected).filter((x) => x !== i)
        : [...(isControlled ? selected! : internalSelected), i];
    }
    if (!isControlled) setInternalSelected(next);
    onSelectionChange?.(next);
  };

  return (
    <div
      ref={ref}
      className={cn('grid grid-cols-3 gap-2', className)}
      {...props}
    >
      {photos.map((photo, i) => {
        const isSelected = selectedSet.has(i);
        return (
          <div
            key={photo.src}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            data-selected={isSelected ? 'true' : undefined}
            className={cn(
              'relative overflow-hidden rounded cursor-pointer aspect-square',
              isSelected && 'ring-2 ring-[var(--forest)] ring-offset-1',
            )}
            onClick={() => toggle(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle(i);
              }
            }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              unoptimized
              sizes="33vw"
              className="object-cover"
            />
            {isSelected && (
              <div className="absolute top-1 right-1 bg-[var(--forest)] text-white rounded-full p-0.5">
                <Check className="h-3 w-3" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

PhotoPicker.displayName = 'PhotoPicker';

export { PhotoPicker };
