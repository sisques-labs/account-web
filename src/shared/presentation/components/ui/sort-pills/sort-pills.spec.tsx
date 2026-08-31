import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SortPills } from './sort-pills';

const options = [
  { value: 'name', label: 'Name' },
  { value: 'date', label: 'Date' },
  { value: 'size', label: 'Size' },
];

describe('SortPills', () => {
  it('active pill has active CVA class', () => {
    const { container } = render(<SortPills options={options} value="name" />);
    const namePill = screen.getByText('Name').closest('button');
    expect(namePill).toHaveClass('bg-[var(--forest)]');
  });

  it('clicking inactive pill calls onSort with its value', async () => {
    const fn = vi.fn();
    render(<SortPills options={options} value="name" onSort={fn} />);
    await userEvent.click(screen.getByText('Date'));
    expect(fn).toHaveBeenCalledWith('date');
  });

  it('renders 3 button elements for 3 options', () => {
    render(<SortPills options={options} />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('merges className prop', () => {
    const { container } = render(<SortPills options={options} className="gap-3" />);
    expect(container.firstChild).toHaveClass('gap-3');
  });
});
