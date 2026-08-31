import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from './date-picker';

describe('DatePicker', () => {
  it('calendar grid is rendered when input receives focus', () => {
    render(<DatePicker />);
    const input = screen.getByRole('textbox');
    fireEvent.click(input);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('clicking a valid date cell closes calendar and calls onChange with ISO string', () => {
    const fn = vi.fn();
    render(<DatePicker onChange={fn} />);
    const input = screen.getByRole('textbox');
    fireEvent.click(input);
    const grid = screen.getByRole('grid');
    const dayCells = grid.querySelectorAll('button[data-day]');
    const firstEnabled = Array.from(dayCells).find((btn) => !(btn as HTMLButtonElement).disabled) as HTMLButtonElement;
    fireEvent.click(firstEnabled);
    expect(fn).toHaveBeenCalledOnce();
    expect(typeof fn.mock.calls[0][0]).toBe('string');
    expect(fn.mock.calls[0][0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('minDate in the future disables all current-month cells', () => {
    render(<DatePicker minDate="2099-01-01" />);
    const input = screen.getByRole('textbox');
    fireEvent.click(input);
    const grid = screen.getByRole('grid');
    const dayCells = grid.querySelectorAll('button[data-day]');
    const enabledCells = Array.from(dayCells).filter((btn) => !(btn as HTMLButtonElement).disabled);
    expect(enabledCells.length).toBe(0);
  });

  it('Escape key closes the calendar', () => {
    render(<DatePicker />);
    const input = screen.getByRole('textbox');
    fireEvent.click(input);
    expect(screen.getByRole('grid')).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('merges className prop', () => {
    const { container } = render(<DatePicker className="w-48" />);
    expect(container.firstChild).toHaveClass('w-48');
  });

  it('month navigation buttons have accessible labels', () => {
    render(<DatePicker />);
    const input = screen.getByRole('textbox');
    fireEvent.click(input);
    expect(screen.getByRole('button', { name: /previous month/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next month/i })).toBeInTheDocument();
  });
});
