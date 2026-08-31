import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Pagination,
  SimplePagination,
  CompactPagination,
  LoadMore,
  TablePaginationFooter,
} from './pagination';

const meta = {
  title: 'Data/Pagination',
  component: Pagination,
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledPagination() {
  const [page, setPage] = React.useState(5);
  return <Pagination page={page} totalPages={20} onPageChange={setPage} />;
}

export const Numbered: Story = {
  args: { page: 5, totalPages: 20, onPageChange: () => {} },
  render: () => <ControlledPagination />,
};

export const FewPages: Story = {
  args: { page: 1, totalPages: 5, onPageChange: () => {} },
};

export const Simple: Story = {
  args: { page: 2, totalPages: 12, onPageChange: () => {} },
  render: function SimpleStory() {
    const [page, setPage] = React.useState(2);
    return <SimplePagination page={page} totalPages={12} onPageChange={setPage} />;
  },
};

export const Compact: Story = {
  args: { page: 2, totalPages: 8, onPageChange: () => {} },
  render: function CompactStory() {
    const [page, setPage] = React.useState(2);
    return <CompactPagination page={page} totalPages={8} onPageChange={setPage} />;
  },
};

export const LoadMoreFeed: Story = {
  args: { page: 1, totalPages: 1, onPageChange: () => {} },
  render: function LoadMoreStory() {
    const total = 247;
    const [loaded, setLoaded] = React.useState(12);
    return (
      <LoadMore
        loaded={loaded}
        total={total}
        onLoadMore={() => setLoaded((l) => Math.min(l + 12, total))}
      />
    );
  },
};

export const TableFooter: Story = {
  args: { page: 1, totalPages: 1, onPageChange: () => {} },
  render: function TableFooterStory() {
    const total = 247;
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(12);
    return (
      <div className="card overflow-hidden">
        <TablePaginationFooter
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>
    );
  },
};
