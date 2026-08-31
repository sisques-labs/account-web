import type { Meta, StoryObj } from "@storybook/react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "./input";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text…",
  },
};

export const WithError: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      <Input placeholder="Enter email" className="border-destructive focus-visible:ring-destructive" />
      <p className="text-xs text-destructive">This field is required.</p>
    </div>
  ),
};

export const Search: Story = {
  render: () => (
    <div className="relative">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input placeholder="Search…" className="pl-8" />
    </div>
  ),
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled input",
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: "Read-only value",
  },
};
