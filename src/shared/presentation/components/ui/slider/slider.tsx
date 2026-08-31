'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  ref?: React.Ref<HTMLInputElement>;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  showValue?: boolean;
}

const Slider = ({ className, min = 0, max = 100, step = 1, value, defaultValue, onChange, showValue, ref, ...props }: SliderProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? min);
  const isControlled = value !== undefined;
  const displayValue = isControlled ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    if (!isControlled) setInternalValue(num);
    onChange?.(num);
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={displayValue}
        onChange={handleChange}
        className="w-full accent-[var(--forest)] cursor-pointer"
        {...props}
      />
      {showValue && (
        <span className="text-sm text-[var(--ink-2)] tabular-nums">{displayValue}</span>
      )}
    </div>
  );
};

Slider.displayName = 'Slider';

export { Slider };
