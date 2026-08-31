import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./alert";

const meta = {
  title: "Feedback/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "warning", "error", "success"],
    },
    title: { control: "text" },
    message: { control: "text" },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: "info",
    message: "This is an informational message.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    message: "This action may have unintended consequences.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    message: "Something went wrong. Please try again.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    message: "Your changes have been saved successfully.",
  },
};

export const WithTitle: Story = {
  args: {
    variant: "info",
    title: "Heads up",
    message: "This alert includes a title for additional context.",
  },
};

export const WithoutTitle: Story = {
  args: {
    variant: "warning",
    message: "This alert has no title, only a message.",
  },
};
