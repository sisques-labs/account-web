import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button/button";
import { Popover } from "./popover";

const meta: Meta = {
  title: "Overlays/Popover",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Popover trigger={<Button variant="outline">Open popover</Button>}>
      <p className="text-sm text-muted-foreground">Quick plant care tip goes here.</p>
    </Popover>
  ),
};
