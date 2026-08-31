import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./label";

const meta = {
  title: "Forms/Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {
    htmlFor: { control: "text" },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standalone: Story = {
  args: {
    children: "Label text",
  },
};

export const AssociatedWithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="associated-input">Email address</Label>
      <input
        id="associated-input"
        type="email"
        placeholder="you@example.com"
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
    </div>
  ),
};
