import type { Meta, StoryObj } from "@storybook/react";
import { Callout } from "./callout";

const meta = {
  title: "Feedback/Callout",
  component: Callout,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["note", "info", "warning", "success", "danger"] },
  },
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Note: Story = {
  args: { variant: "note", title: "Tip", children: "Water your plants in the morning for best absorption." },
};
export const Warning: Story = {
  args: { variant: "warning", title: "Frost alert", children: "Bring sensitive plants indoors tonight." },
};
export const Success: Story = {
  args: { variant: "success", children: "Care log entry saved successfully." },
};
