import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultSelect() {
  const [value, setValue] = React.useState("");
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
      </SelectContent>
    </Select>
  );
}

function SelectWithOptions() {
  const [value, setValue] = React.useState("banana");
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
        <SelectItem value="mango">Mango</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
      </SelectContent>
    </Select>
  );
}

function OpenSelect() {
  const [value, setValue] = React.useState("");
  return (
    <div className="pb-40">
      <Select defaultOpen value={value} onValueChange={setValue}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export const Default: Story = {
  render: () => <DefaultSelect />,
};

export const WithOptions: Story = {
  render: () => <SelectWithOptions />,
};

export const Open: Story = {
  render: () => <OpenSelect />,
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Disabled" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="item">Item</SelectItem>
      </SelectContent>
    </Select>
  ),
};
