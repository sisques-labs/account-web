'use client';

import * as React from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface LightboxPhoto {
  src: string;
  alt: string;
  caption?: string;
}

export interface LightboxProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  photos: LightboxPhoto[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

const Lightbox = ({ className, photos, initialIndex = 0, open, onClose, ref, ...props }: LightboxProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentIndex((i) => Math.min(i + 1, photos.length - 1));
      if (e.key === 'ArrowLeft') setCurrentIndex((i) => Math.max(i - 1, 0));
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose, photos.length]);

  if (!open) return null;

  const photo = photos[currentIndex];

  return (
    <div
      ref={ref}
      role="presentation"
      className={cn('fixed inset-0 z-50 flex items-center justify-center bg-black/80', className)}
      onClick={onClose}
      {...props}
    >
      <div
        className="relative max-w-4xl max-h-screen p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={1200}
          height={900}
          unoptimized
          className="h-auto w-auto max-h-[80vh] max-w-full rounded"
        />

        {photo.caption && (
          <p className="mt-2 text-center text-sm text-white/80">{photo.caption}</p>
        )}

        {/* Close button */}
        <button
          type="button"
          aria-label="Close lightbox"
          onClick={onClose}
          className="absolute -top-2 -right-2 bg-[var(--paper)] rounded-full p-1 shadow"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Navigation */}
        {photos.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() => setCurrentIndex((i) => i - 1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-[var(--paper)] rounded-full p-2 shadow"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            {currentIndex < photos.length - 1 && (
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-[var(--paper)] rounded-full p-2 shadow"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

Lightbox.displayName = 'Lightbox';

export { Lightbox };
