import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StarRating } from './star-rating';

describe('StarRating', () => {
  it('readOnly: renders 3 filled and 2 empty stars for value=3', () => {
    render(<StarRating value={3} readOnly />);
    const filled = document.querySelectorAll('[data-filled="true"]');
    const empty = document.querySelectorAll('[data-filled="false"]');
    expect(filled).toHaveLength(3);
    expect(empty).toHaveLength(2);
  });

  it('interactive: clicking 4th star calls onChange with 4', async () => {
    const fn = vi.fn();
    render(<StarRating value={2} onChange={fn} />);
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[3]); // 4th star (0-indexed)
    expect(fn).toHaveBeenCalledWith(4);
  });

  it('readOnly: stars are not buttons', () => {
    render(<StarRating value={3} readOnly />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('merges className prop', () => {
    const { container } = render(<StarRating value={3} readOnly className="gap-1" />);
    expect(container.firstChild).toHaveClass('gap-1');
  });

  it('interactive: each star button has an accessible label', () => {
    render(<StarRating value={2} max={5} />);
    expect(screen.getByRole('button', { name: 'Rate 1 star' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Rate 4 stars' })).toBeInTheDocument();
  });
});
