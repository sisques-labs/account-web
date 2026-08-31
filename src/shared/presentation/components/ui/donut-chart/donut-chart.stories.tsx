import type { Meta, StoryObj } from "@storybook/react";
import { DonutChart } from "./donut-chart";

const segments = [
  { label: "Healthy", value: 45 },
  { label: "Needs water", value: 20 },
  { label: "Repot soon", value: 10 },
];

const meta = {
  title: "Data/DonutChart",
  component: DonutChart,
  tags: ["autodocs"],
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { segments, centerLabel: "75", size: 140 } };
