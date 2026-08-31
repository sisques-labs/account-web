import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface DonutChartSegment {
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartProps extends React.SVGProps<SVGSVGElement> {
  ref?: React.Ref<SVGSVGElement>;
  segments: DonutChartSegment[];
  centerLabel?: string;
  size?: number;
}

const SEGMENT_COLORS = [
  'var(--forest-2)',
  'var(--honey)',
  'var(--terracotta)',
  'var(--sage)',
  'var(--forest)',
  'var(--honey-2)',
];

const DonutChart = ({ className, segments, centerLabel, size = 120, ref, ...props }: DonutChartProps) => {
  const strokeWidth = 12;
  const r = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * r;
  const total = segments.reduce((acc, s) => acc + s.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;

  const segmentsWithOffsets = segments.reduce<{ seg: DonutChartSegment; arcLen: number; offset: number; index: number }[]>(
    (acc, seg, i) => {
      const arcLen = (seg.value / total) * circumference;
      const prevOffset = acc.length === 0 ? circumference * 0.25 : acc[acc.length - 1].offset - acc[acc.length - 1].arcLen;
      return [...acc, { seg, arcLen, offset: prevOffset, index: i }];
    },
    [],
  );

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={cn(className)}
      aria-label="Donut chart"
      role="img"
      {...props}
    >
      {/* Background ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="var(--paper-2)"
        strokeWidth={strokeWidth}
      />

      {segmentsWithOffsets.map(({ seg, arcLen, offset, index }) => (
          <circle
            key={seg.label}
            data-segment
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color ?? SEGMENT_COLORS[index % SEGMENT_COLORS.length]}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLen} ${circumference - arcLen}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
      ))}

      {centerLabel && (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.1}
          fill="var(--ink)"
        >
          {centerLabel}
        </text>
      )}
    </svg>
  );
};

DonutChart.displayName = 'DonutChart';

export { DonutChart };
