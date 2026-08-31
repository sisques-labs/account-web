import type { Meta, StoryObj } from "@storybook/react";
import { StatusDot } from "./status-dot";

const meta = {
  title: "UI/StatusDot",
  component: StatusDot,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["good", "warn", "bad", "inactive"],
    },
  },
} satisfies Meta<typeof StatusDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Good: Story = {
  args: { status: "good" },
};

export const Warn: Story = {
  args: { status: "warn" },
};

export const Bad: Story = {
  args: { status: "bad" },
};

export const Inactive: Story = {
  args: { status: "inactive" },
};
