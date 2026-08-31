import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SearchInput } from "./search-input";

const meta = {
  title: "Forms/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledSearch() {
  const [value, setValue] = React.useState("monstera");
  return (
    <SearchInput
      placeholder="Search plants…"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClear={() => setValue("")}
      className="w-72"
    />
  );
}

export const Default: Story = {
  render: () => <SearchInput placeholder="Search plants…" className="w-72" />,
};
export const WithValue: Story = { render: () => <ControlledSearch /> };
