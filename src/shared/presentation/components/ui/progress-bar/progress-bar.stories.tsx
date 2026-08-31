import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "./progress-bar";

const meta = {
  title: "Feedback/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["determinate", "indeterminate", "stepped"] },
    value: { control: { type: "range", min: 0, max: 100 } },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Determinate: Story = { args: { variant: "determinate", value: 65 } };
export const Indeterminate: Story = { args: { variant: "indeterminate" } };
export const Stepped: Story = { args: { variant: "stepped", steps: 4, currentStep: 2 } };
