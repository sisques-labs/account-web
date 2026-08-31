import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable, SortableHeader } from './table';

type Person = { name: string; age: number };

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
];

const data: Person[] = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 },
];

describe('DataTable', () => {
  it('renders all rows', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('reorders rows on first header click', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} />);

    const cellsBefore = screen.getAllByRole('cell');
    // Verify initial order: Alice, Bob, Charlie
    expect(cellsBefore[1]).toHaveTextContent('Alice');

    await user.click(screen.getByText('Age'));

    const cellsAfter = screen.getAllByRole('cell');
    // After first click, rows reordered (asc or desc — verify it's different from initial)
    const firstNameCell = cellsAfter[1];
    expect(firstNameCell).not.toHaveTextContent('Alice'); // order changed
  });

  it('reverses sort on second header click', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} />);

    await user.click(screen.getByText('Age'));
    const cellsAfterFirst = screen.getAllByRole('cell');
    const firstAfterFirst = cellsAfterFirst[1].textContent;

    await user.click(screen.getByText('Age'));
    const cellsAfterSecond = screen.getAllByRole('cell');
    const firstAfterSecond = cellsAfterSecond[1].textContent;

    // Second click reverses the order from the first click
    expect(firstAfterSecond).not.toBe(firstAfterFirst);
  });

  it('SortableHeader button has type="button" so it never accidentally submits a form', () => {
    const column = { getIsSorted: () => false as const, toggleSorting: vi.fn() };
    render(<SortableHeader column={column}>Name</SortableHeader>);
    expect(screen.getByRole('button', { name: /name/i })).toHaveAttribute('type', 'button');
  });

  it('sortable header responds to Enter key for keyboard users', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} />);

    const header = screen.getByText('Age');
    header.focus();
    await user.keyboard('{Enter}');

    const cellsAfterFirst = screen.getAllByRole('cell');
    const firstAfterFirst = cellsAfterFirst[1].textContent;

    await user.keyboard('{Enter}');
    const cellsAfterSecond = screen.getAllByRole('cell');
    const firstAfterSecond = cellsAfterSecond[1].textContent;

    expect(firstAfterSecond).not.toBe(firstAfterFirst);
  });

  it('calls onSelectionChange when row checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <DataTable columns={columns} data={data} onSelectionChange={onSelectionChange} />,
    );

    const checkboxes = screen.getAllByRole('checkbox');
    // first checkbox is "select all", row checkboxes follow
    await user.click(checkboxes[1]);

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ name: 'Alice' })]),
    );
  });

  it('select all header checkbox selects all rows', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <DataTable columns={columns} data={data} onSelectionChange={onSelectionChange} />,
    );

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]); // select all

    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Alice' }),
        expect.objectContaining({ name: 'Bob' }),
        expect.objectContaining({ name: 'Charlie' }),
      ]),
    );
  });

  it('does not render pagination controls by default', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.queryByLabelText('Previous page')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next page')).not.toBeInTheDocument();
  });

  it('renders the pagination footer when pagination prop is provided', () => {
    const onPageChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        pagination={{ page: 1, pageSize: 12, total: 50, onPageChange }}
      />,
    );
    expect(screen.getByText('1–12 of 50')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
  });
});
