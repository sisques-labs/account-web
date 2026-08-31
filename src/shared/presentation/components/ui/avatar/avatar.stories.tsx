import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    className: { control: "text" },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage
        src="https://github.com/shadcn.png"
        alt="Avatar"
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const InitialsFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>JS</AvatarFallback>
    </Avatar>
  ),
};
