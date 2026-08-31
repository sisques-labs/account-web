import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface LineAreaChartDataPoint {
  x: number | string;
  y: number;
}

export interface LineAreaChartProps extends React.SVGProps<SVGSVGElement> {
  ref?: React.Ref<SVGSVGElement>;
  data: LineAreaChartDataPoint[];
  height?: number;
}

const VIEW_WIDTH = 300;
const PADDING = 10;

const LineAreaChart = ({ className, data, height = 200, ref, ...props }: LineAreaChartProps) => {
  if (data.length === 0) return null;

  const chartH = height - PADDING * 2;
  const chartW = VIEW_WIDTH - PADDING * 2;
  const minY = Math.min(...data.map((d) => d.y));
  const maxY = Math.max(...data.map((d) => d.y));
  const rangeY = maxY - minY || 1;

  const toX = (i: number) => PADDING + (i / (data.length - 1 || 1)) * chartW;
  const toY = (y: number) => PADDING + chartH - ((y - minY) / rangeY) * chartH;

  const linePoints = data.map((d, i) => `${toX(i)},${toY(d.y)}`).join(' ');
  const areaPoints = [
    `${toX(0)},${PADDING + chartH}`,
    ...data.map((d, i) => `${toX(i)},${toY(d.y)}`),
    `${toX(data.length - 1)},${PADDING + chartH}`,
  ].join(' ');

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
      width="100%"
      height={height}
      className={cn(className)}
      aria-label="Line area chart"
      role="img"
      {...props}
    >
      <polygon
        points={areaPoints}
        fill="var(--forest-bg)"
        stroke="none"
      />
      <polyline
        points={linePoints}
        fill="none"
        stroke="var(--forest-2)"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

LineAreaChart.displayName = 'LineAreaChart';

export { LineAreaChart };
