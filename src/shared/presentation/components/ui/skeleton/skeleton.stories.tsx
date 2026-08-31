import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./skeleton";

const meta = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["line", "circle", "block"] },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Block: Story = { args: { variant: "block", className: "h-24 w-64" } };
export const Line: Story = { args: { variant: "line", className: "w-48" } };
export const Circle: Story = { args: { variant: "circle", className: "h-12 w-12" } };
