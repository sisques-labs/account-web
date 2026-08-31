import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./date-picker";

const meta = {
  title: "Forms/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledDatePicker() {
  const [value, setValue] = React.useState("2026-06-17");
  return <DatePicker value={value} onChange={setValue} />;
}

export const Default: Story = { args: {} };
export const Controlled: Story = {
  args: {},
  render: () => <ControlledDatePicker />,
};
