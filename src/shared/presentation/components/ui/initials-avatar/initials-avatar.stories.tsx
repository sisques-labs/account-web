import type { Meta, StoryObj } from "@storybook/react";
import { InitialsAvatar } from "./initials-avatar";

const meta = {
  title: "UI/InitialsAvatar",
  component: InitialsAvatar,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
  },
} satisfies Meta<typeof InitialsAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { name: "Jane Doe" } };
export const Large: Story = { args: { name: "Gardenia Labs", size: "lg" } };
