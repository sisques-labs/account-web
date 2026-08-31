import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WeekStrip } from './week-strip';

describe('WeekStrip', () => {
  it('renders exactly 7 day cells', () => {
    render(<WeekStrip weekStartDate="2024-06-10" />);
    expect(document.querySelectorAll('[data-day-cell]')).toHaveLength(7);
  });

  it('activeDate cell has active class', () => {
    render(<WeekStrip weekStartDate="2024-06-10" activeDate="2024-06-12" />);
    const cells = document.querySelectorAll('[data-day-cell]');
    const activeCell = cells[2]; // index 2 = June 12
    expect(activeCell).toHaveClass('bg-[var(--forest)]');
  });

  it('clicking a cell calls onDateClick with ISO date', async () => {
    const fn = vi.fn();
    render(<WeekStrip weekStartDate="2024-06-10" onDateClick={fn} />);
    const cells = document.querySelectorAll('[data-day-cell]');
    await userEvent.click(cells[1]); // June 11
    expect(fn).toHaveBeenCalledWith('2024-06-11');
  });

  it('merges className prop', () => {
    const { container } = render(<WeekStrip weekStartDate="2024-06-10" className="gap-1" />);
    expect(container.firstChild).toHaveClass('gap-1');
  });
});
