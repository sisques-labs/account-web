import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./accordion";

const items = [
  { id: "care", title: "Care schedule", content: "Water every 3 days during summer." },
  { id: "light", title: "Light requirements", content: "Bright indirect light, avoid direct noon sun." },
  { id: "soil", title: "Soil mix", content: "Well-draining potting mix with perlite." },
];

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  tags: ["autodocs"],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = { args: { items, mode: "single" } };
export const Multiple: Story = { args: { items, mode: "multiple", defaultOpen: ["care"] } };
