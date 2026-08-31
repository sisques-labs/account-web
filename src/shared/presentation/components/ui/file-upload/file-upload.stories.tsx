import type { Meta, StoryObj } from "@storybook/react";
import { FileUpload } from "./file-upload";

const meta = {
  title: "Forms/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { accept: "image/*", className: "w-96" } };
export const Multiple: Story = { args: { accept: "image/*", multiple: true, maxSizeMB: 5, className: "w-96" } };
