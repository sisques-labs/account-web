import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./checkbox";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

function UncheckedCheckbox() {
  const [checked, setChecked] = React.useState<boolean | "indeterminate">(false);
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={(val) => setChecked(val as boolean | "indeterminate")}
    />
  );
}

function CheckedCheckbox() {
  const [checked, setChecked] = React.useState<boolean | "indeterminate">(true);
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={(val) => setChecked(val as boolean | "indeterminate")}
    />
  );
}

function IndeterminateCheckbox() {
  const [checked, setChecked] = React.useState<boolean | "indeterminate">("indeterminate");
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={(val) => setChecked(val as boolean | "indeterminate")}
    />
  );
}

export const Unchecked: Story = {
  render: () => <UncheckedCheckbox />,
};

export const Checked: Story = {
  render: () => <CheckedCheckbox />,
};

export const Indeterminate: Story = {
  render: () => <IndeterminateCheckbox />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    checked: false,
  },
};
