import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button/button";
import { Drawer } from "./drawer";

const meta: Meta = {
  title: "Overlays/Drawer",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

function DrawerDemo({ side = "right" }: { side?: "right" | "left" | "bottom" }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} side={side} title="Plant details">
        <p className="text-sm text-muted-foreground">Drawer content for editing plant information.</p>
      </Drawer>
    </>
  );
}

export const Right: Story = { render: () => <DrawerDemo side="right" /> };
export const Bottom: Story = { render: () => <DrawerDemo side="bottom" /> };
