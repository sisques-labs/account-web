import type { Meta, StoryObj } from "@storybook/react";
import { BarChart } from "./bar-chart";

const data = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 18 },
  { label: "Wed", value: 9 },
  { label: "Thu", value: 22 },
  { label: "Fri", value: 15 },
];

const meta = {
  title: "Data/BarChart",
  component: BarChart,
  tags: ["autodocs"],
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { data, height: 200 } };
