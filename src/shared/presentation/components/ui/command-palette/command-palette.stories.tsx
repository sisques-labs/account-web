import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Leaf, Plus, Search } from "lucide-react";
import { Button } from "../button/button";
import { CommandPalette } from "./command-palette";

const commands = [
  { id: "search", label: "Search plants", group: "Navigation", action: () => {}, icon: <Search className="h-4 w-4" /> },
  { id: "add", label: "Add plant", group: "Actions", action: () => {}, icon: <Plus className="h-4 w-4" /> },
  { id: "care", label: "Log care", group: "Actions", action: () => {}, icon: <Leaf className="h-4 w-4" /> },
];

const meta: Meta = {
  title: "Overlays/CommandPalette",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

function CommandPaletteDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open command palette</Button>
      <CommandPalette open={open} onClose={() => setOpen(false)} commands={commands} />
    </>
  );
}

export const Default: Story = { render: () => <CommandPaletteDemo /> };
