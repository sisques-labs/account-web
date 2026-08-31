import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FilterBar, type FilterDescriptor } from "./filter-bar";
import type { ActiveFilter } from "../active-filter-chips/active-filter-chips";

const meta: Meta = {
  title: "Data/FilterBar",
  component: FilterBar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

function FilterBarDemo() {
  const [query, setQuery] = React.useState("");
  const [types, setTypes] = React.useState<string[]>([]);
  const [lowStockOnly, setLowStockOnly] = React.useState(false);

  const typeOptions = [
    { value: "SEEDS", label: "Seeds" },
    { value: "FERTILIZER", label: "Fertilizer" },
    { value: "SUBSTRATE", label: "Substrate" },
  ];

  const filters: FilterDescriptor[] = [
    { type: "search", key: "search", placeholder: "Search by name…", value: query, onChange: setQuery },
    {
      type: "select",
      key: "type",
      allLabel: "All types",
      selectedSuffix: "types selected",
      options: typeOptions,
      selected: types,
      onToggle: (value) =>
        setTypes((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value])),
    },
    { type: "toggle", key: "lowStock", label: "Low stock", checked: lowStockOnly, onChange: () => setLowStockOnly((v) => !v) },
  ];

  const chips: ActiveFilter[] = [
    ...(query.trim() ? [{ key: "search", label: `Search: ${query.trim()}` }] : []),
    ...types.map((t) => ({ key: `type:${t}`, label: typeOptions.find((o) => o.value === t)?.label ?? t })),
    ...(lowStockOnly ? [{ key: "lowStock", label: "Low stock" }] : []),
  ];

  function onRemoveChip(key: string) {
    if (key === "search") setQuery("");
    else if (key === "lowStock") setLowStockOnly(false);
    else if (key.startsWith("type:")) setTypes((prev) => prev.filter((t) => t !== key.slice("type:".length)));
  }

  return <FilterBar filters={filters} chips={chips} onRemoveChip={onRemoveChip} />;
}

export const Default: Story = {
  render: () => <FilterBarDemo />,
};
