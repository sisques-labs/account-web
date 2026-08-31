import type { Meta, StoryObj } from "@storybook/react";
import { NumericBadge } from "./numeric-badge";

const meta = {
  title: "UI/NumericBadge",
  component: NumericBadge,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "primary", "danger"] },
  },
} satisfies Meta<typeof NumericBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { count: 3 } };
export const Overflow: Story = { args: { count: 120, max: 99 } };
export const Danger: Story = { args: { count: 5, variant: "danger" } };
