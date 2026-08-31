import type { Meta, StoryObj } from "@storybook/react";
import { HealthDots } from "./health-dots";

const meta = {
  title: "Domain/HealthDots",
  component: HealthDots,
  tags: ["autodocs"],
} satisfies Meta<typeof HealthDots>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Healthy: Story = { args: { value: 5, max: 5 } };
export const Moderate: Story = { args: { value: 3, max: 5 } };
export const Low: Story = { args: { value: 1, max: 5 } };
