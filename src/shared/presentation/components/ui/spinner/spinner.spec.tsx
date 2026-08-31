import { render, screen } from '@testing-library/react';
import { Spinner } from './spinner';

describe('Spinner', () => {
  it('has role="status"', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('contains visually-hidden "Loading…" text by default', () => {
    render(<Spinner />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('applies CVA lg size class for size="lg"', () => {
    const { container } = render(<Spinner size="lg" />);
    const el = container.querySelector('[role="status"]');
    expect(el).toHaveClass('h-10');
  });

  it('renders custom label text', () => {
    render(<Spinner label="Saving changes" />);
    expect(screen.getByText('Saving changes')).toBeInTheDocument();
  });

  it('merges className prop', () => {
    const { container } = render(<Spinner className="mt-4" />);
    expect(container.firstChild).toHaveClass('mt-4');
  });
});
