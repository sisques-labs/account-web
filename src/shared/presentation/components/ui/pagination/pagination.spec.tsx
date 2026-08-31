import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import {
  Pagination,
  SimplePagination,
  CompactPagination,
  LoadMore,
  TablePaginationFooter,
  usePageRange,
} from './pagination';

describe('usePageRange', () => {
  it('lists every page when total fits without ellipsis', () => {
    const { result } = renderHook(() => usePageRange(1, 5));
    expect(result.current).toEqual([1, 2, 3, 4, 5]);
  });

  it('inserts ellipsis markers on both sides for a mid page', () => {
    const { result } = renderHook(() => usePageRange(10, 20));
    expect(result.current).toEqual([1, 'ellipsis-left', 9, 10, 11, 'ellipsis-right', 20]);
  });

  it('keeps the left edge contiguous near the start', () => {
    const { result } = renderHook(() => usePageRange(2, 20));
    expect(result.current).toEqual([1, 2, 3, 'ellipsis-right', 20]);
  });
});

describe('Pagination', () => {
  it('previous button is disabled on first page', () => {
    render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('next button is disabled on last page', () => {
    render(<Pagination page={5} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('clicking a page button calls onPageChange with that page number', async () => {
    const fn = vi.fn();
    render(<Pagination page={2} totalPages={5} onPageChange={fn} />);
    await userEvent.click(screen.getByText('4'));
    expect(fn).toHaveBeenCalledWith(4);
  });

  it('renders an ellipsis for large page counts', () => {
    render(<Pagination page={10} totalPages={20} onPageChange={() => {}} />);
    expect(screen.getAllByText('…').length).toBeGreaterThan(0);
  });

  it('merges className prop', () => {
    const { container } = render(
      <Pagination page={1} totalPages={3} onPageChange={() => {}} className="mt-4" />,
    );
    expect(container.firstChild).toHaveClass('mt-4');
  });
});

describe('SimplePagination', () => {
  it('renders previous / next with a page indicator', () => {
    render(<SimplePagination page={2} totalPages={12} onPageChange={() => {}} />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('2 / 12')).toBeInTheDocument();
  });

  it('advances to the next page', async () => {
    const fn = vi.fn();
    render(<SimplePagination page={2} totalPages={12} onPageChange={fn} />);
    await userEvent.click(screen.getByLabelText('Next page'));
    expect(fn).toHaveBeenCalledWith(3);
  });
});

describe('CompactPagination', () => {
  it('disables previous on the first page', () => {
    render(<CompactPagination page={1} totalPages={8} onPageChange={() => {}} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });
});

describe('LoadMore', () => {
  it('calls onLoadMore when clicked', async () => {
    const fn = vi.fn();
    render(<LoadMore loaded={12} total={48} onLoadMore={fn} />);
    await userEvent.click(screen.getByText('Load more'));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('shows the done label once everything is loaded', () => {
    render(<LoadMore loaded={48} total={48} onLoadMore={() => {}} doneLabel="All done" />);
    expect(screen.getByText('All done')).toBeInTheDocument();
    expect(screen.queryByText('Load more')).not.toBeInTheDocument();
  });
});

describe('TablePaginationFooter', () => {
  it('renders the item range summary', () => {
    render(
      <TablePaginationFooter page={3} pageSize={12} total={247} onPageChange={() => {}} />,
    );
    expect(screen.getByText('25–36 of 247')).toBeInTheDocument();
  });

  it('renders the per-page selector only when onPageSizeChange is provided', () => {
    const { rerender } = render(
      <TablePaginationFooter page={1} pageSize={12} total={50} onPageChange={() => {}} />,
    );
    expect(screen.queryByLabelText('Items per page')).not.toBeInTheDocument();

    rerender(
      <TablePaginationFooter
        page={1}
        pageSize={12}
        total={50}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />,
    );
    expect(screen.getByLabelText('Items per page')).toBeInTheDocument();
  });
});
