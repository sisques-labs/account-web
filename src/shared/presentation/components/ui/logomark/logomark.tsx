import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface LogomarkProps extends React.SVGAttributes<SVGSVGElement> {
  ref?: React.Ref<SVGSVGElement>;
  /** Rendered width/height in px. Defaults to 40. */
  size?: number;
}

/**
 * The Sisques Account "S" mark — a rounded blue square with a white
 * initial, matching design-import/logomark.svg from the Claude Design
 * canvas. Rendered inline (rather than as a static asset) so callers can
 * resize it via `size` without shipping multiple raster/SVG files.
 */
const Logomark = ({ className, size = 40, ref, ...props }: LogomarkProps) => (
  <svg
    ref={ref}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width={size}
    height={size}
    role="img"
    aria-label="Sisqués"
    className={cn(className)}
    {...props}
  >
    <rect width="48" height="48" rx="12" fill="#2563eb" />
    <text
      x="24"
      y="33"
      textAnchor="middle"
      fontFamily="Inter, -apple-system, 'Segoe UI', sans-serif"
      fontSize="26"
      fontWeight="800"
      fill="#fff"
    >
      S
    </text>
  </svg>
);

Logomark.displayName = 'Logomark';

export { Logomark };
