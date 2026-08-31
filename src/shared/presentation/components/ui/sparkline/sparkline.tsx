import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface SparklineProps extends React.SVGProps<SVGSVGElement> {
  ref?: React.Ref<SVGSVGElement>;
  data: number[];
  width?: number;
  height?: number;
}

const Sparkline = ({ className, data, width = 80, height = 24, ref, ...props }: SparklineProps) => {
  if (data.length === 0) return null;

  const minY = Math.min(...data);
  const maxY = Math.max(...data);
  const rangeY = maxY - minY || 1;
  const padding = 2;

  const toX = (i: number) =>
    data.length === 1 ? width / 2 : padding + (i / (data.length - 1)) * (width - padding * 2);
  const toY = (y: number) =>
    padding + (height - padding * 2) - ((y - minY) / rangeY) * (height - padding * 2);

  const points =
    data.length === 1
      ? `0,${height / 2} ${width},${height / 2}`
      : data.map((y, i) => `${toX(i)},${toY(y)}`).join(' ');

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn(className)}
      aria-hidden="true"
      {...props}
    >
      <polyline
        points={points}
        fill="none"
        stroke="var(--forest-2)"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

Sparkline.displayName = 'Sparkline';

export { Sparkline };
