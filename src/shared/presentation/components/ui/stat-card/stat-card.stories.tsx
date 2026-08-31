import type { Meta, StoryObj } from "@storybook/react";
import { Leaf } from "lucide-react";
import { StatCard } from "./stat-card";

const meta = {
  title: "Domain/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    delta: { control: "text" },
    deltaPositive: { control: "boolean" },
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PositiveDelta: Story = {
  args: {
    label: "Total Plants",
    value: "142",
    delta: "+12% this month",
    deltaPositive: true,
  },
};

export const NegativeDelta: Story = {
  args: {
    label: "Unhealthy Plants",
    value: "8",
    delta: "+3 since last week",
    deltaPositive: false,
  },
};

export const WithIcon: Story = {
  args: {
    label: "Active Spaces",
    value: "6",
    delta: "+1 this month",
    deltaPositive: true,
    icon: <Leaf className="h-4 w-4 text-muted-foreground" />,
  },
};

export const Minimal: Story = {
  args: {
    label: "Spaces",
    value: "6",
  },
};
