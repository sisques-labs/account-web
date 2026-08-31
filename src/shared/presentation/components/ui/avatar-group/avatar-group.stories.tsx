import type { Meta, StoryObj } from "@storybook/react";
import { AvatarGroup } from "./avatar-group";

const items = [
  { name: "Alice Chen" },
  { name: "Bob Rivera" },
  { name: "Carol Smith" },
  { name: "Dan Kim" },
  { name: "Eve Park" },
];

const meta = {
  title: "UI/AvatarGroup",
  component: AvatarGroup,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    max: { control: "number" },
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { items, max: 4 } };
export const Small: Story = { args: { items, size: "sm", max: 3 } };
