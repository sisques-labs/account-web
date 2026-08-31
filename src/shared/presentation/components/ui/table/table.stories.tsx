import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTable, SortableHeader } from "./table";

type Plant = {
  id: string;
  name: string;
  status: "healthy" | "warning" | "critical";
  lastWatered: string;
  space: string;
};

const plantData: Plant[] = [
  { id: "1", name: "Monstera Deliciosa", status: "healthy", lastWatered: "2026-06-01", space: "Greenhouse A" },
  { id: "2", name: "Fiddle Leaf Fig", status: "warning", lastWatered: "2026-05-28", space: "Living Room" },
  { id: "3", name: "Peace Lily", status: "healthy", lastWatered: "2026-06-03", space: "Office" },
  { id: "4", name: "Pothos", status: "critical", lastWatered: "2026-05-20", space: "Bedroom" },
  { id: "5", name: "Snake Plant", status: "healthy", lastWatered: "2026-06-04", space: "Greenhouse B" },
];

const columns: ColumnDef<Plant>[] = [
  {
    accessorKey: "name",
    header: "Plant Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "space",
    header: "Space",
  },
  {
    accessorKey: "lastWatered",
    header: "Last Watered",
  },
];

const sortableColumns: ColumnDef<Plant>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column}>Plant Name</SortableHeader>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <SortableHeader column={column}>Status</SortableHeader>
    ),
  },
  {
    accessorKey: "space",
    header: "Space",
  },
  {
    accessorKey: "lastWatered",
    header: ({ column }) => (
      <SortableHeader column={column}>Last Watered</SortableHeader>
    ),
  },
];

// DataTable is generic — all stories use render wrappers that supply columns+data
// directly, so we don't bind a component type on Meta (no args inference needed).
const meta: Meta = {
  title: "Data/DataTable",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const WithData: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={plantData}
      enableRowSelection={false}
    />
  ),
};

function SortableTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  return (
    <DataTable
      columns={sortableColumns}
      data={plantData}
      enableRowSelection={false}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}

export const WithSorting: Story = {
  render: () => <SortableTable />,
};

function SelectableTable() {
  const [selected, setSelected] = React.useState<Plant[]>([]);
  return (
    <div className="flex flex-col gap-2">
      <DataTable
        columns={columns}
        data={plantData}
        enableRowSelection
        onSelectionChange={setSelected}
      />
      <p className="text-xs text-muted-foreground">
        Selected: {selected.length} row{selected.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

export const WithRowSelection: Story = {
  render: () => <SelectableTable />,
};

function PaginatedTable() {
  const total = 247;
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(12);
  return (
    <DataTable
      columns={columns}
      data={plantData}
      enableRowSelection={false}
      pagination={{
        page,
        pageSize,
        total,
        onPageChange: setPage,
        onPageSizeChange: (size) => {
          setPageSize(size);
          setPage(1);
        },
      }}
    />
  );
}

export const WithPagination: Story = {
  render: () => <PaginatedTable />,
};
