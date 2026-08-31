import type { Meta, StoryObj } from "@storybook/react";
import { EventCard } from "./event-card";

const meta = {
  title: "Domain/EventCard",
  component: EventCard,
  tags: ["autodocs"],
} satisfies Meta<typeof EventCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: "Water all indoor plants", time: "9:00 AM", location: "Living room", className: "w-72" },
};
