import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["forest", "honey", "terra", "sage", "neutral", "outline"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
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

export const Neutral: Story = {
  args: {
    variant: "neutral",
    children: "Neutral",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};
