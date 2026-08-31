import * as React from 'react';
import { Check } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const stepVariants = cva('flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold border-2 flex-shrink-0', {
  variants: {
    state: {
      completed: 'bg-[var(--forest)] border-[var(--forest)] text-[var(--white)]',
      active: 'bg-[var(--paper)] border-[var(--forest)] text-[var(--forest)]',
      upcoming: 'bg-[var(--paper)] border-[var(--rule)] text-[var(--ink-3)]',
    },
  },
  defaultVariants: {
    state: 'upcoming',
  },
});

type StepState = 'completed' | 'active' | 'upcoming';

export interface Step {
  id: string;
  label: string;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  steps: Step[];
  currentStep: number;
}

const Stepper = ({ className, steps, currentStep, ref, ...props }: StepperProps) => (
  <div ref={ref} className={cn('flex items-center', className)} {...props}>
    {steps.map((step, i) => {
      const state: StepState =
        i < currentStep ? 'completed' : i === currentStep ? 'active' : 'upcoming';

      return (
        <React.Fragment key={step.id}>
          <div
            data-step
            data-state={state}
            aria-current={state === 'active' ? 'step' : undefined}
            className="flex flex-col items-center gap-1"
          >
            <div className={stepVariants({ state })}>
              {state === 'completed' ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={cn(
              'text-xs',
              state === 'active' ? 'text-[var(--forest)] font-medium' :
              state === 'completed' ? 'text-[var(--ink-2)]' : 'text-[var(--ink-3)]'
            )}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn(
              'flex-1 h-0.5 mx-2',
              i < currentStep ? 'bg-[var(--forest)]' : 'bg-[var(--rule)]'
            )} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

Stepper.displayName = 'Stepper';

export { Stepper };
