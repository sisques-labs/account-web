import type { Meta, StoryObj } from "@storybook/react";
import { ContextMenu } from "./context-menu";

const items = [
  { label: "Water now", action: () => {} },
  { label: "Add care note", action: () => {} },
  { label: "Archive plant", action: () => {}, disabled: true },
];

const meta: Meta = {
  title: "Overlays/ContextMenu",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <ContextMenu items={items}>
      <div className="flex h-32 w-64 items-center justify-center rounded border border-dashed text-sm text-muted-foreground">
        Right-click here
      </div>
    </ContextMenu>
  ),
};
