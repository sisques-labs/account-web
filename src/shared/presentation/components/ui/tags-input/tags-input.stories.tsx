import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TagsInput } from "./tags-input";

const meta = {
  title: "Forms/TagsInput",
  component: TagsInput,
  tags: ["autodocs"],
} satisfies Meta<typeof TagsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledTags() {
  const [tags, setTags] = React.useState(["indoor", "low-light"]);
  return <TagsInput value={tags} onChange={setTags} className="w-96" />;
}

export const Default: Story = { args: { defaultValue: ["herb", "perennial"], className: "w-96" } };
export const Controlled: Story = {
  args: { defaultValue: ["herb", "perennial"], className: "w-96" },
  render: () => <ControlledTags />,
};
