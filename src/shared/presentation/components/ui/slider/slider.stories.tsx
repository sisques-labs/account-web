import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./slider";

const meta = {
  title: "Forms/Slider",
  component: Slider,
  tags: ["autodocs"],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledSlider() {
  const [value, setValue] = React.useState(40);
  return <Slider value={value} onChange={setValue} showValue className="w-72" />;
}

export const Default: Story = { args: { defaultValue: 50, showValue: true, className: "w-72" } };
export const Controlled: Story = {
  args: { defaultValue: 50, showValue: true, className: "w-72" },
  render: () => <ControlledSlider />,
};
