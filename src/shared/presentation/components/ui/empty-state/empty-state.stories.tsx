import type { Meta, StoryObj } from "@storybook/react";
import { Leaf } from "lucide-react";
import { Button } from "../button/button";
import { EmptyState } from "./empty-state";

const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "No plants yet",
    description: "Add your first plant to start tracking care.",
    icon: <Leaf className="h-8 w-8 text-muted-foreground" />,
  },
};

export const WithAction: Story = {
  args: {
    title: "No results found",
    description: "Try adjusting your search or filters.",
    action: <Button size="sm">Clear filters</Button>,
  },
};
