import type { Meta, StoryObj } from "@storybook/react";
import { RowSkeleton } from "./row-skeleton";

const meta = {
  title: "Feedback/RowSkeleton",
  component: RowSkeleton,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RowSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
