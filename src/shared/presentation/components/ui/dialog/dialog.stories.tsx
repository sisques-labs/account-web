import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "../button/button";

const meta = {
  title: "Overlays/Dialog",
  component: Dialog,
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultDialog() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description of what this dialog is about.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Dialog body content goes here.
        </p>
      </DialogContent>
    </Dialog>
  );
}

function DialogWithContent() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Open with Content</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-2">
          <input
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            placeholder="Name"
          />
          <input
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            placeholder="Email"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DialogWithFooterActions() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Open with Footer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to proceed with this action?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Default: Story = {
  render: () => <DefaultDialog />,
};

export const WithContent: Story = {
  render: () => <DialogWithContent />,
};

export const WithFooterActions: Story = {
  render: () => <DialogWithFooterActions />,
};
