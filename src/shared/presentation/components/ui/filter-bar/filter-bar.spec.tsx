import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FilterBar, type FilterDescriptor } from './filter-bar';

describe('FilterBar', () => {
  it('renders a search input and calls onChange with the typed value', () => {
    const onChange = vi.fn();
    const filters: FilterDescriptor[] = [
      { type: 'search', key: 'q', placeholder: 'Search…', value: '', onChange },
    ];
    render(<FilterBar filters={filters} />);

    fireEvent.change(screen.getByPlaceholderText('Search…'), { target: { value: 'lettuce' } });

    expect(onChange).toHaveBeenCalledWith('lettuce');
  });

  it('renders a toggle and calls onChange when clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const filters: FilterDescriptor[] = [
      { type: 'toggle', key: 'lowStock', label: 'Low stock', checked: false, onChange },
    ];
    render(<FilterBar filters={filters} />);

    await user.click(screen.getByText('Low stock'));

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('shows "allLabel" when a select filter has nothing selected', () => {
    const filters: FilterDescriptor[] = [
      {
        type: 'select',
        key: 'type',
        allLabel: 'All types',
        selectedSuffix: 'selected',
        options: [{ value: 'A', label: 'Alpha' }],
        selected: [],
        onToggle: vi.fn(),
      },
    ];
    render(<FilterBar filters={filters} />);
    expect(screen.getByRole('button', { name: 'All types' })).toBeInTheDocument();
  });

  it('shows the single option label when exactly one is selected', () => {
    const filters: FilterDescriptor[] = [
      {
        type: 'select',
        key: 'type',
        allLabel: 'All types',
        selectedSuffix: 'selected',
        options: [{ value: 'A', label: 'Alpha' }, { value: 'B', label: 'Beta' }],
        selected: ['A'],
        onToggle: vi.fn(),
      },
    ];
    render(<FilterBar filters={filters} />);
    expect(screen.getByRole('button', { name: 'Alpha' })).toBeInTheDocument();
  });

  it('shows a count when multiple options are selected', () => {
    const filters: FilterDescriptor[] = [
      {
        type: 'select',
        key: 'type',
        allLabel: 'All types',
        selectedSuffix: 'selected',
        options: [{ value: 'A', label: 'Alpha' }, { value: 'B', label: 'Beta' }],
        selected: ['A', 'B'],
        onToggle: vi.fn(),
      },
    ];
    render(<FilterBar filters={filters} />);
    expect(screen.getByRole('button', { name: '2 selected' })).toBeInTheDocument();
  });

  it('calls onToggle with the option value when a checkbox item is checked, and keeps the dropdown open', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const filters: FilterDescriptor[] = [
      {
        type: 'select',
        key: 'type',
        allLabel: 'All types',
        selectedSuffix: 'selected',
        options: [{ value: 'A', label: 'Alpha' }, { value: 'B', label: 'Beta' }],
        selected: [],
        onToggle,
      },
    ];
    render(<FilterBar filters={filters} />);

    await user.click(screen.getByRole('button', { name: 'All types' }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Alpha' }));

    expect(onToggle).toHaveBeenCalledWith('A');
    expect(screen.getByRole('menuitemcheckbox', { name: 'Beta' })).toBeInTheDocument();
  });

  it('renders chips and calls onRemoveChip with the chip key', () => {
    const onRemoveChip = vi.fn();
    render(
      <FilterBar
        filters={[]}
        chips={[{ key: 'search', label: 'Search: lettuce' }]}
        onRemoveChip={onRemoveChip}
      />,
    );

    fireEvent.click(screen.getByLabelText('Remove Search: lettuce'));

    expect(onRemoveChip).toHaveBeenCalledWith('search');
  });

  it('renders no chips row content when chips is empty', () => {
    const { container } = render(<FilterBar filters={[]} />);
    expect(container.querySelector('.chip')).not.toBeInTheDocument();
  });

  it('merges the className prop onto the outer container', () => {
    const { container } = render(<FilterBar filters={[]} className="w-full" />);
    expect(container.firstChild).toHaveClass('w-full');
  });
});
