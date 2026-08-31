import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button/button";
import { Tooltip } from "./tooltip";

const meta: Meta = {
  title: "Overlays/Tooltip",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tooltip content="Water every 3 days">
      <Button variant="outline">Hover me</Button>
    </Tooltip>
  ),
};
export const Bottom: Story = {
  render: () => (
    <Tooltip content="Needs repotting soon" side="bottom">
      <Button variant="outline">Plant status</Button>
    </Tooltip>
  ),
};
