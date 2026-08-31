import { render } from '@testing-library/react';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('renders with shimmer animation class by default', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('animate-shimmer');
  });

  it('circle variant applies rounded-full', () => {
    const { container } = render(<Skeleton variant="circle" width={40} height={40} />);
    expect(container.firstChild).toHaveClass('rounded-full');
  });

  it('circle variant applies explicit dimension styles', () => {
    const { container } = render(<Skeleton variant="circle" width={40} height={40} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('40px');
    expect(el.style.height).toBe('40px');
  });

  it('has aria-hidden="true"', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('merges className prop', () => {
    const { container } = render(<Skeleton className="mt-2" />);
    expect(container.firstChild).toHaveClass('mt-2');
  });
});
