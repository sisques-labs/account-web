import type { Meta, StoryObj } from "@storybook/react";
import { UserCard } from "./user-card";

const meta = {
  title: "Domain/UserCard",
  component: UserCard,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof UserCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: { name: "Alice Chen", secondary: "Garden curator", orientation: "horizontal" },
};
export const Vertical: Story = {
  args: { name: "Bob Rivera", secondary: "Space admin", orientation: "vertical", size: "lg" },
};
