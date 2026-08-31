import type { Meta, StoryObj } from "@storybook/react";
import { ActiveFilterChips } from "./active-filter-chips";

const filters = [
  { key: "status", label: "Status: Healthy" },
  { key: "space", label: "Space: Living Room" },
];

const meta = {
  title: "Data/ActiveFilterChips",
  component: ActiveFilterChips,
  tags: ["autodocs"],
} satisfies Meta<typeof ActiveFilterChips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { filters, onRemove: (key) => console.log("remove", key) },
};
