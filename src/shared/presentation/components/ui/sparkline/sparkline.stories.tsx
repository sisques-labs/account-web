import type { Meta, StoryObj } from "@storybook/react";
import { Sparkline } from "./sparkline";

const meta = {
  title: "Data/Sparkline",
  component: Sparkline,
  tags: ["autodocs"],
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { data: [4, 8, 6, 12, 9, 14, 11] } };
export const TrendingUp: Story = { args: { data: [2, 4, 5, 8, 10, 14, 18], width: 120, height: 32 } };
