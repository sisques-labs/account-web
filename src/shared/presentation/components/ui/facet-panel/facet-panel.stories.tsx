import type { Meta, StoryObj } from "@storybook/react";
import { FacetPanel } from "./facet-panel";

const facets = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "healthy", label: "Healthy" },
      { value: "needs-care", label: "Needs care" },
    ],
  },
  {
    key: "light",
    label: "Light",
    options: [
      { value: "low", label: "Low light" },
      { value: "bright", label: "Bright indirect" },
    ],
  },
];

const meta = {
  title: "Data/FacetPanel",
  component: FacetPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof FacetPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { facets, selected: { status: ["healthy"] }, className: "w-64" },
};
