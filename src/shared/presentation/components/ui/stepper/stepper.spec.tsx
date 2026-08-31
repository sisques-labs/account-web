import { render, screen } from '@testing-library/react';
import { Stepper } from './stepper';

const steps = [
  { id: 's1', label: 'Info' },
  { id: 's2', label: 'Details' },
  { id: 's3', label: 'Review' },
];

describe('Stepper', () => {
  it('current step has aria-current="step"', () => {
    render(<Stepper steps={steps} currentStep={1} />);
    expect(screen.getByText('Details').closest('[aria-current="step"]')).toBeInTheDocument();
  });

  it('steps before currentStep have completed class', () => {
    const { container } = render(<Stepper steps={steps} currentStep={2} />);
    const stepEls = container.querySelectorAll('[data-step]');
    expect(stepEls[0]).toHaveAttribute('data-state', 'completed');
    expect(stepEls[1]).toHaveAttribute('data-state', 'completed');
  });

  it('steps after currentStep have upcoming class distinct from active', () => {
    const { container } = render(<Stepper steps={steps} currentStep={0} />);
    const stepEls = container.querySelectorAll('[data-step]');
    expect(stepEls[1]).toHaveAttribute('data-state', 'upcoming');
    expect(stepEls[2]).toHaveAttribute('data-state', 'upcoming');
  });

  it('merges className prop', () => {
    const { container } = render(<Stepper steps={steps} currentStep={0} className="gap-4" />);
    expect(container.firstChild).toHaveClass('gap-4');
  });
});
