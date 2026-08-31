import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CalendarMonth } from './calendar-month';

describe('CalendarMonth', () => {
  it('renders 7 day-of-week column headers', () => {
    render(<CalendarMonth year={2024} month={6} />);
    const headers = document.querySelectorAll('[data-day-header]');
    expect(headers).toHaveLength(7);
  });

  it('June 2024 has 30 day cells', () => {
    render(<CalendarMonth year={2024} month={6} />);
    const dayCells = document.querySelectorAll('[data-day-cell]');
    expect(dayCells).toHaveLength(30);
  });

  it('clicking day 15 calls onDateClick with "2024-06-15"', async () => {
    const fn = vi.fn();
    render(<CalendarMonth year={2024} month={6} onDateClick={fn} />);
    const dayCell = Array.from(document.querySelectorAll('[data-day-cell]')).find(
      (el) => el.textContent?.trim() === '15',
    ) as HTMLElement;
    await userEvent.click(dayCell);
    expect(fn).toHaveBeenCalledWith('2024-06-15');
  });

  it('merges className prop', () => {
    const { container } = render(<CalendarMonth year={2024} month={6} className="w-full" />);
    expect(container.firstChild).toHaveClass('w-full');
  });
});
