import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StarRating } from "./star-rating";

const meta = {
  title: "Forms/StarRating",
  component: StarRating,
  tags: ["autodocs"],
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledRating() {
  const [value, setValue] = React.useState(3);
  return <StarRating value={value} onChange={setValue} />;
}

export const Default: Story = { args: { value: 4 } };
export const ReadOnly: Story = { args: { value: 5, readOnly: true } };
export const Controlled: Story = {
  args: { value: 3 },
  render: () => <ControlledRating />,
};
