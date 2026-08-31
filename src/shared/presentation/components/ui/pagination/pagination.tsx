import * as React from 'react';
import { ChevronLeft, ChevronRight, Sprout } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

// ─── Page range item ─────────────────────────────────────────────────────────
// A page number, or an ellipsis marker (left/right kept distinct for stable keys).
export type PageItem = number | 'ellipsis-left' | 'ellipsis-right';

/**
 * usePageRange — builds the page range with ellipsis and fixed boundaries.
 *
 * @param current     Active page (1-based).
 * @param total       Total number of pages.
 * @param siblings    Pages shown on each side of the current page.
 * @param boundaries  Pages pinned at each edge.
 *
 * @example usePageRange(5, 20) → [1, 'ellipsis-left', 4, 5, 6, 'ellipsis-right', 20]
 */
export function usePageRange(
  current: number,
  total: number,
  siblings = 1,
  boundaries = 1,
): PageItem[] {
  return React.useMemo(() => {
    const totalNumbers = siblings * 2 + boundaries * 2 + 3; // current + 2 ellipsis + edges
    if (total <= totalNumbers) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const left = Math.max(current - siblings, boundaries + 2);
    const right = Math.min(current + siblings, total - boundaries - 1);
    const showLeftDots = left > boundaries + 2;
    const showRightDots = right < total - boundaries - 1;

    const range: PageItem[] = [];
    for (let i = 1; i <= boundaries; i++) range.push(i);
    range.push(showLeftDots ? 'ellipsis-left' : boundaries + 1);
    for (let i = left; i <= right; i++) range.push(i);
    range.push(showRightDots ? 'ellipsis-right' : total - boundaries);
    for (let i = total - boundaries + 1; i <= total; i++) range.push(i);
    return range;
  }, [current, total, siblings, boundaries]);
}

// ─── Reusable page button ────────────────────────────────────────────────────
export interface PageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  /** Square (icon/number) when true, padded (with label) when false. */
  square?: boolean;
}

function PageButton({
  active = false,
  disabled = false,
  square = true,
  className,
  children,
  ...props
}: PageButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex h-[34px] items-center justify-center gap-1.5 rounded-md text-[13px] transition-all',
        square ? 'min-w-[34px] px-0' : 'px-[11px]',
        active
          ? 'border border-[var(--forest)] bg-[var(--forest)] font-semibold text-[var(--white)] shadow-[0_1px_2px_rgba(60,40,20,0.12)]'
          : disabled
            ? 'cursor-not-allowed border border-transparent font-medium text-[var(--ink-3)] opacity-45'
            : 'cursor-pointer border border-transparent font-medium text-[var(--ink-2)] hover:border-[var(--rule)] hover:bg-[var(--paper-2)]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── Numbered pagination (with ellipsis) ─────────────────────────────────────
export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Pages shown on each side of the current page. */
  siblings?: number;
  /** Pages pinned at each edge. */
  boundaries?: number;
  ref?: React.Ref<HTMLElement>;
}

function Pagination({
  ref,
  className,
  page,
  totalPages,
  onPageChange,
  siblings = 1,
  boundaries = 1,
  ...props
}: PaginationProps) {
  const pages = usePageRange(page, totalPages, siblings, boundaries);

  return (
    <nav
      ref={ref}
      aria-label="Pagination"
      className={cn('flex items-center gap-1', className)}
      {...props}
    >
        <PageButton
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-[15px] w-[15px]" />
        </PageButton>

        {pages.map((p) =>
          typeof p === 'string' ? (
            <span
              key={p}
              aria-hidden="true"
              className="min-w-[30px] select-none text-center text-sm text-[var(--ink-3)]"
            >
              …
            </span>
          ) : (
            <PageButton
              key={p}
              active={p === page}
              aria-label={`Page ${p}`}
              onClick={() => onPageChange(p)}
            >
              <span className="tnum">{p}</span>
            </PageButton>
          ),
        )}

        <PageButton
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-[15px] w-[15px]" />
        </PageButton>
      </nav>
  );
}

// ─── Simple pagination (previous / next, no numbers) ─────────────────────────
export interface SimplePaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  ref?: React.Ref<HTMLDivElement>;
}

function SimplePagination({ ref, className, page, totalPages, onPageChange, ...props }: SimplePaginationProps) {
  return (
    <div ref={ref} className={cn('flex items-center gap-2.5', className)} {...props}>
      <PageButton
        square={false}
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-[15px] w-[15px]" />
        <span>Previous</span>
      </PageButton>

      <span className="tnum min-w-12 text-center font-mono text-xs text-[var(--ink-3)]">
        {page} / {totalPages}
      </span>

      <PageButton
        square={false}
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <span>Next</span>
        <ChevronRight className="h-[15px] w-[15px]" />
      </PageButton>
    </div>
  );
}

// ─── Compact pagination (circular arrows) ────────────────────────────────────
function CompactPagination({ ref, className, page, totalPages, onPageChange, ...props }: SimplePaginationProps) {
  const arrow =
    'inline-flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-[var(--rule)] bg-[var(--paper)] text-[var(--ink-2)] transition-colors hover:bg-[var(--paper-2)] disabled:cursor-not-allowed disabled:opacity-40';
  return (
    <div ref={ref} className={cn('flex items-center gap-2', className)} {...props}>
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={arrow}
        >
          <ChevronLeft className="h-[15px] w-[15px]" />
        </button>
        <span className="text-sm text-[var(--ink-2)]">
          <strong className="tnum text-[var(--ink)]">{page}</strong> / {totalPages}
        </span>
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={arrow}
        >
          <ChevronRight className="h-[15px] w-[15px]" />
        </button>
      </div>
  );
}

// ─── Load more (feeds / infinite lists) ──────────────────────────────────────
export interface LoadMoreProps extends React.HTMLAttributes<HTMLDivElement> {
  loaded: number;
  total: number;
  onLoadMore: () => void;
  /** Button label while there are more items. */
  label?: string;
  /** Message shown once everything is loaded. */
  doneLabel?: string;
  ref?: React.Ref<HTMLDivElement>;
}

function LoadMore({ ref, className, loaded, total, onLoadMore, label = 'Load more', doneLabel = 'No more items', ...props }: LoadMoreProps) {
  const done = loaded >= total;
  const pct = total > 0 ? Math.min((loaded / total) * 100, 100) : 0;
  return (
    <div ref={ref} className={cn('w-full text-center', className)} {...props}>
        {done ? (
          <div className="font-hand text-lg text-[var(--terracotta)]">{doneLabel}</div>
        ) : (
          <button
            type="button"
            onClick={onLoadMore}
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[var(--rule)] bg-[var(--paper-2)] px-[22px] py-2.5 text-[13px] font-medium text-[var(--ink)] transition-all hover:border-[var(--forest-2)] hover:bg-[var(--forest-bg)]"
          >
            <Sprout className="h-[15px] w-[15px] text-[var(--forest)]" />
            {label}
          </button>
        )}
        <div className="mt-3 flex flex-col items-center gap-[7px]">
          <div className="h-[5px] w-[200px] overflow-hidden rounded-full border border-[var(--rule)] bg-[var(--paper-2)]">
            <div
              className="h-full rounded-full bg-[var(--forest)] transition-[width] duration-300 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="tnum font-mono text-xs text-[var(--ink-3)]">
            {loaded} of {total}
          </div>
        </div>
      </div>
  );
}

// ─── Table footer (summary + per-page + numbered) ────────────────────────────
export interface TablePaginationFooterProps extends React.HTMLAttributes<HTMLDivElement> {
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
  ref?: React.Ref<HTMLDivElement>;
}

function TablePaginationFooter(
  {
    ref,
    className,
    page,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [12, 24, 48, 96],
    ...props
  }: TablePaginationFooterProps,
) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, total);

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] bg-[var(--paper-2)] px-[18px] py-3.5',
          className,
        )}
        {...props}
      >
        <div className="tnum font-mono text-xs text-[var(--ink-3)]">
          {from}–{to} of {total}
        </div>

        <div className="flex flex-wrap items-center gap-[18px]">
          {onPageSizeChange && (
            <label className="flex items-center gap-2 text-[12.5px] text-[var(--ink-2)]">
              Per page
              <select
                aria-label="Items per page"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="cursor-pointer rounded-md border-[1.5px] border-[var(--rule)] bg-[var(--paper)] px-2 py-1 text-[12.5px] text-[var(--ink)] outline-none"
              >
                {pageSizeOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          )}
          <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      </div>
  );
}

Pagination.displayName = 'Pagination';
SimplePagination.displayName = 'SimplePagination';
CompactPagination.displayName = 'CompactPagination';
LoadMore.displayName = 'LoadMore';
TablePaginationFooter.displayName = 'TablePaginationFooter';

export {
  Pagination,
  SimplePagination,
  CompactPagination,
  LoadMore,
  TablePaginationFooter,
};
