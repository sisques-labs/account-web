import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "../label/label";

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultRadioGroup() {
  const [value, setValue] = React.useState("");
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option1" id="r1" />
        <Label htmlFor="r1">Option 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option2" id="r2" />
        <Label htmlFor="r2">Option 2</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option3" id="r3" />
        <Label htmlFor="r3">Option 3</Label>
      </div>
    </RadioGroup>
  );
}

function RadioGroupWithSelection() {
  const [value, setValue] = React.useState("option2");
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option1" id="rs1" />
        <Label htmlFor="rs1">Option 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option2" id="rs2" />
        <Label htmlFor="rs2">Option 2</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option3" id="rs3" />
        <Label htmlFor="rs3">Option 3</Label>
      </div>
    </RadioGroup>
  );
}

export const Default: Story = {
  render: () => <DefaultRadioGroup />,
};

export const WithSelection: Story = {
  render: () => <RadioGroupWithSelection />,
};
