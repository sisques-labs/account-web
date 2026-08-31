import type { Meta, StoryObj } from "@storybook/react";
import { LineAreaChart } from "./line-area-chart";

const data = [
  { x: "Jan", y: 10 },
  { x: "Feb", y: 14 },
  { x: "Mar", y: 8 },
  { x: "Apr", y: 20 },
  { x: "May", y: 16 },
];

const meta = {
  title: "Data/LineAreaChart",
  component: LineAreaChart,
  tags: ["autodocs"],
} satisfies Meta<typeof LineAreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { data, height: 200 } };
