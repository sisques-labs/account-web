import { render } from '@testing-library/react';
import { RowSkeleton } from './row-skeleton';

describe('RowSkeleton', () => {
  it('renders a bordered row placeholder', () => {
    const { container } = render(<RowSkeleton />);
    expect(container.querySelector('.rounded-lg.border')).toBeInTheDocument();
  });

  it('renders shimmer placeholder blocks', () => {
    const { container } = render(<RowSkeleton />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });
});
