import { render } from '@testing-library/react';
import { HealthDots } from './health-dots';

describe('HealthDots', () => {
  it('renders 5 dot elements for max=5', () => {
    render(<HealthDots value={3} max={5} />);
    expect(document.querySelectorAll('[data-dot]')).toHaveLength(5);
  });

  it('2 filled and 3 empty for value=2 max=5', () => {
    render(<HealthDots value={2} max={5} />);
    expect(document.querySelectorAll('[data-filled="true"]')).toHaveLength(2);
    expect(document.querySelectorAll('[data-filled="false"]')).toHaveLength(3);
  });

  it('0 filled dots for value=0', () => {
    render(<HealthDots value={0} max={5} />);
    expect(document.querySelectorAll('[data-filled="true"]')).toHaveLength(0);
  });

  it('merges className prop', () => {
    const { container } = render(<HealthDots value={3} className="gap-2" />);
    expect(container.firstChild).toHaveClass('gap-2');
  });
});
