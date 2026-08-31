import type { Meta, StoryObj } from "@storybook/react";
import { toast } from "sonner";
import { Toaster } from "./toaster";
import { Button } from "../button/button";

const meta = {
  title: "Feedback/Toaster",
  component: Toaster,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="default"
        onClick={() => toast.success("Changes saved successfully.")}
      >
        Success
      </Button>
      <Button
        variant="destructive"
        onClick={() => toast.error("Something went wrong.")}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning("This action may have consequences.")}
      >
        Warning
      </Button>
      <Button
        variant="ghost"
        onClick={() => toast.info("Here is some useful information.")}
      >
        Info
      </Button>
    </div>
  ),
};
