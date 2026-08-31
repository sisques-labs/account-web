import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { WeekStrip } from "./week-strip";

const meta = {
  title: "Forms/WeekStrip",
  component: WeekStrip,
  tags: ["autodocs"],
} satisfies Meta<typeof WeekStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledWeekStrip() {
  const [active, setActive] = React.useState("2026-06-17");
  return (
    <WeekStrip weekStartDate="2026-06-16" activeDate={active} onDateClick={setActive} />
  );
}

export const Default: Story = {
  args: { weekStartDate: "2026-06-16", activeDate: "2026-06-17" },
};
export const Controlled: Story = {
  args: { weekStartDate: "2026-06-16", activeDate: "2026-06-17" },
  render: () => <ControlledWeekStrip />,
};
