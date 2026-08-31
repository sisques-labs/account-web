'use client';

import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Checkbox } from '../checkbox/checkbox';
import { TablePaginationFooter } from '../pagination/pagination';

export interface DataTablePagination {
  /** Active page (1-based). */
  page: number;
  /** Items per page. */
  pageSize: number;
  /** Total number of items across all pages. */
  total: number;
  onPageChange: (page: number) => void;
  /** When provided, renders the "per page" selector. */
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export interface DataTableProps<TData, TValue = unknown> {
  ref?: React.Ref<HTMLDivElement>;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enableRowSelection?: boolean;
  onSelectionChange?: (rows: TData[]) => void;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  /** When provided, renders a pagination footer below the table. */
  pagination?: DataTablePagination;
  className?: string;
}

export function SortableHeader({
  column,
  children,
}: {
  column: { getIsSorted: () => false | 'asc' | 'desc'; toggleSorting: (desc?: boolean) => void };
  children: React.ReactNode;
}) {
  const sorted = column.getIsSorted();
  return (
    <button
      type="button"
      className="flex items-center gap-1 text-left font-medium"
      onClick={() => column.toggleSorting(sorted === 'asc')}
    >
      {children}
      {sorted === 'asc' ? (
        <ChevronUp className="h-4 w-4" />
      ) : sorted === 'desc' ? (
        <ChevronDown className="h-4 w-4" />
      ) : (
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
      )}
    </button>
  );
}
SortableHeader.displayName = 'SortableHeader';

function DataTableInner<TData, TValue = unknown>(
  { ref, columns, data, enableRowSelection = true, onSelectionChange, sorting: sortingProp, onSortingChange, pagination, className }: DataTableProps<TData, TValue>,
) {
  const [sortingInternal, setSortingInternal] = React.useState<SortingState>([]);
  const isControlledSort = sortingProp !== undefined;
  const sorting = isControlledSort ? sortingProp : sortingInternal;
  const setSorting = (updater: SortingState | ((prev: SortingState) => SortingState)) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater;
    if (isControlledSort) onSortingChange?.(next);
    else setSortingInternal(next);
  };
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const selectionColumn: ColumnDef<TData, TValue> = {
    id: '__select__',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? 'indeterminate'
              : false
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  const tableColumns = enableRowSelection ? [selectionColumn, ...columns] : columns;

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(rowSelection) : updater;
      setRowSelection(next);
      if (onSelectionChange) {
        const selectedRows: TData[] = [];
        for (const key of Object.keys(next)) {
          if (next[key]) selectedRows.push(data[Number(key)]);
        }
        onSelectionChange(selectedRows);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div ref={ref} className={cn('card overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b border-[var(--rule)]">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="h-10 px-4 text-left align-middle eyebrow"
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    onKeyDown={
                      header.column.getCanSort()
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }
                        : undefined
                    }
                    tabIndex={header.column.getCanSort() ? 0 : undefined}
                    style={header.column.getCanSort() ? { cursor: 'pointer' } : undefined}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className={cn(
                  'border-b border-[var(--rule)] transition-colors hover:bg-[var(--paper-2)]',
                  row.getIsSelected() && 'bg-[var(--forest-bg)]',
                )}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && <TablePaginationFooter {...pagination} />}
    </div>
  );
}

DataTableInner.displayName = 'DataTable';

export const DataTable = DataTableInner as <TData, TValue = unknown>(
  props: DataTableProps<TData, TValue>,
) => React.ReactElement;
