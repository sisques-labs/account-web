import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmDialog } from "./confirm-dialog";
import { Button } from "../button/button";

// ConfirmDialog requires open+onOpenChange as controlled props — all stories
// use render wrappers that manage state internally, so we omit component type
// binding on Meta to avoid requiring args that are owned by the wrapper.
const meta: Meta = {
  title: "Overlays/ConfirmDialog",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

function DefaultConfirmDialog() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Confirm Dialog</Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Confirm Action"
        description="Are you sure you want to proceed? This action cannot be undone."
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

function DestructiveConfirmDialog() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete Item
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete Item"
        description="This will permanently delete the item. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

export const Default: Story = {
  render: () => <DefaultConfirmDialog />,
};

export const Destructive: Story = {
  render: () => <DestructiveConfirmDialog />,
};
