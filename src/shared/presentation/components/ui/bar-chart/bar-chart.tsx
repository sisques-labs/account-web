import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface BarChartDataPoint {
  label: string;
  value: number;
}

export interface BarChartProps extends React.SVGProps<SVGSVGElement> {
  ref?: React.Ref<SVGSVGElement>;
  data: BarChartDataPoint[];
  height?: number;
}

const VIEW_WIDTH = 300;
const LABEL_HEIGHT = 20;
const PADDING = 10;

const BarChart = ({ className, data, height = 200, ref, ...props }: BarChartProps) => {
  if (data.length === 0) return null;

  const chartH = height - LABEL_HEIGHT - PADDING;
  const maxVal = Math.max(...data.map((d) => d.value));
  const barW = (VIEW_WIDTH - PADDING * 2) / data.length - 4;
  const gap = 4;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
      width="100%"
      height={height}
      className={cn(className)}
      aria-label="Bar chart"
      role="img"
      {...props}
    >
      {data.map((d, i) => {
        const barH = maxVal === 0 ? 0 : (d.value / maxVal) * chartH;
        const x = PADDING + i * (barW + gap);
        const y = PADDING + chartH - barH;
        return (
          <g key={d.label}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              fill="var(--forest-2)"
              rx={2}
            />
            <text
              x={x + barW / 2}
              y={PADDING + chartH + LABEL_HEIGHT - 4}
              textAnchor="middle"
              fontSize={10}
              fill="var(--ink-3)"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

BarChart.displayName = 'BarChart';

export { BarChart };
