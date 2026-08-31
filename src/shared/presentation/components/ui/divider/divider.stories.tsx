import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "./divider";

const meta = {
  title: "Layout/Divider",
  component: Divider,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = { args: { orientation: "horizontal" } };
export const WithLabel: Story = { args: { label: "or" } };
export const Vertical: Story = {
  render: () => (
    <div className="flex h-12 items-center gap-4">
      <span className="text-sm">Grid</span>
      <Divider orientation="vertical" />
      <span className="text-sm">List</span>
    </div>
  ),
};
