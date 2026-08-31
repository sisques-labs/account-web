import { render, screen } from '@testing-library/react';
import { UserCard } from './user-card';

describe('UserCard', () => {
  it('renders name and secondary', () => {
    render(<UserCard name="Ana García" secondary="admin" />);
    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('vertical orientation applies flex-col class', () => {
    const { container } = render(<UserCard name="Bob" orientation="vertical" />);
    expect(container.firstChild).toHaveClass('flex-col');
  });

  it('does not render empty secondary element when omitted', () => {
    const { container } = render(<UserCard name="Solo" />);
    const secondary = container.querySelector('[data-secondary]');
    expect(secondary).not.toBeInTheDocument();
  });

  it('merges className prop', () => {
    const { container } = render(<UserCard name="Bob" className="p-4" />);
    expect(container.firstChild).toHaveClass('p-4');
  });
});
