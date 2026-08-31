import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "./chip";

const meta = {
  title: "UI/Chip",
  component: Chip,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "forest", "honey", "terra", "sage", "outline"],
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    children: "Default",
  },
};

export const Forest: Story = {
  args: {
    variant: "forest",
    children: "Forest",
  },
};

export const Honey: Story = {
  args: {
    variant: "honey",
    children: "Honey",
  },
};

export const Terra: Story = {
  args: {
    variant: "terra",
    children: "Terra",
  },
};

export const Sage: Story = {
  args: {
    variant: "sage",
    children: "Sage",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};
