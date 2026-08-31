import type { Meta, StoryObj } from "@storybook/react";
import { Blockquote } from "./blockquote";

const meta = {
  title: "UI/Blockquote",
  component: Blockquote,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["pullquote", "diary-note", "stat-highlight"] },
  },
} satisfies Meta<typeof Blockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pullquote: Story = {
  args: { variant: "pullquote", cite: "Monty Don", children: "The glory of gardening: hands in the dirt, head in the sun, heart with nature." },
};
export const DiaryNote: Story = {
  args: { variant: "diary-note", children: "Repotted the monstera today — roots were circling the pot." },
};
