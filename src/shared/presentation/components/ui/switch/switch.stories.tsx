import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./switch";

const meta = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

function OffSwitch() {
  const [checked, setChecked] = React.useState(false);
  return <Switch checked={checked} onCheckedChange={setChecked} />;
}

function OnSwitch() {
  const [checked, setChecked] = React.useState(true);
  return <Switch checked={checked} onCheckedChange={setChecked} />;
}

export const Off: Story = {
  render: () => <OffSwitch />,
};

export const On: Story = {
  render: () => <OnSwitch />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    checked: false,
  },
};
