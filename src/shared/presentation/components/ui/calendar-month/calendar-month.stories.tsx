import type { Meta, StoryObj } from "@storybook/react";
import { CalendarMonth } from "./calendar-month";

const meta = {
  title: "Forms/CalendarMonth",
  component: CalendarMonth,
  tags: ["autodocs"],
} satisfies Meta<typeof CalendarMonth>;

export default meta;
type Story = StoryObj<typeof meta>;

export const June2026: Story = { args: { year: 2026, month: 6 } };
