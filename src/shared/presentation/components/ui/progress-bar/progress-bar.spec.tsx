import { render, screen } from '@testing-library/react';
import { ProgressBar } from './progress-bar';

describe('ProgressBar', () => {
  it('determinate: fill width reflects value and aria-valuenow is set', () => {
    render(<ProgressBar value={60} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '60');
    const fill = bar.querySelector('[data-fill]') as HTMLElement;
    expect(fill).toBeTruthy();
    expect(fill.style.width).toBe('60%');
  });

  it('determinate: has role="progressbar"', () => {
    render(<ProgressBar value={60} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('indeterminate: has no aria-valuenow', () => {
    render(<ProgressBar variant="indeterminate" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
  });

  it('indeterminate: animation class present', () => {
    const { container } = render(<ProgressBar variant="indeterminate" />);
    const fill = container.querySelector('.animate-progress-indeterminate');
    expect(fill).toBeInTheDocument();
  });

  it('stepped: renders correct segment count', () => {
    const { container } = render(<ProgressBar variant="stepped" steps={4} currentStep={2} />);
    const segments = container.querySelectorAll('[data-segment]');
    expect(segments).toHaveLength(4);
  });

  it('stepped: correct number of completed segments', () => {
    const { container } = render(<ProgressBar variant="stepped" steps={4} currentStep={2} />);
    const completed = container.querySelectorAll('[data-completed="true"]');
    expect(completed).toHaveLength(2);
  });

  it('merges className prop', () => {
    const { container } = render(<ProgressBar className="mt-4" />);
    expect(container.firstChild).toHaveClass('mt-4');
  });
});
