import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "./stepper";

const steps = [
  { id: "details", label: "Plant details" },
  { id: "location", label: "Location" },
  { id: "care", label: "Care plan" },
  { id: "review", label: "Review" },
];

const meta = {
  title: "UI/Stepper",
  component: Stepper,
  tags: ["autodocs"],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StepOne: Story = { args: { steps, currentStep: 0 } };
export const StepThree: Story = { args: { steps, currentStep: 2 } };
export const Complete: Story = { args: { steps, currentStep: 4 } };
