import type { Meta, StoryObj } from "@storybook/react";
import { KbdShortcut } from "./kbd-shortcut";

const meta = {
  title: "UI/KbdShortcut",
  component: KbdShortcut,
  tags: ["autodocs"],
} satisfies Meta<typeof KbdShortcut>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { keys: ["⌘", "K"] } };
export const MultiKey: Story = { args: { keys: ["Ctrl", "Shift", "P"] } };
