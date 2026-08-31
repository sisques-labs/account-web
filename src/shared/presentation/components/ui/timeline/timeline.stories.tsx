import type { Meta, StoryObj } from "@storybook/react";
import { Timeline } from "./timeline";

const events = [
  { id: "1", timestamp: "Today, 9:00 AM", title: "Watered Monstera", description: "250ml distilled water" },
  { id: "2", timestamp: "Yesterday", title: "Rotated pots", description: "Even light exposure" },
  { id: "3", timestamp: "Mon", title: "Fertilized herbs", description: "Organic liquid feed" },
];

const meta = {
  title: "Data/Timeline",
  component: Timeline,
  tags: ["autodocs"],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { events } };
