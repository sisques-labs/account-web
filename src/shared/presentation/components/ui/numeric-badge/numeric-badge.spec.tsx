import { render, screen } from '@testing-library/react';
import { NumericBadge } from './numeric-badge';

describe('NumericBadge', () => {
  it('renders count directly', () => {
    render(<NumericBadge count={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('caps at max and shows "99+"', () => {
    render(<NumericBadge count={150} max={99} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('danger variant applies CVA danger class', () => {
    const { container } = render(<NumericBadge count={3} variant="danger" />);
    expect(container.firstChild).toHaveClass('bg-[var(--terracotta)]');
  });

  it('merges className prop', () => {
    const { container } = render(<NumericBadge count={1} className="ml-1" />);
    expect(container.firstChild).toHaveClass('ml-1');
  });
});
