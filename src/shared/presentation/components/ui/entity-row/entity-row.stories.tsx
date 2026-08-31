import type { Meta, StoryObj } from "@storybook/react";
import { Droplets, Pencil, ShoppingBasket, Trash2 } from "lucide-react";
import { EntityRow, EntityRowAction } from "./entity-row";

const meta = {
  title: "Domain/EntityRow",
  component: EntityRow,
  tags: ["autodocs"],
  args: {
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>Tomate cherry</span>
        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>3.5 kg · 20 jun 2026</span>
      </div>
    ),
    actions: (
      <>
        <EntityRowAction icon={<Pencil className="w-4 h-4" />} label="Editar" onClick={() => {}} />
        <EntityRowAction icon={<Trash2 className="w-4 h-4" />} label="Eliminar" onClick={() => {}} variant="destructive" />
      </>
    ),
  },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EntityRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIconBadge: Story = {
  args: {
    icon: <Droplets className="w-4 h-4" />,
    iconVariant: "sky",
  },
};

export const WithCompleteCheckbox: Story = {
  args: {
    icon: <ShoppingBasket className="w-4 h-4" />,
    iconVariant: "honey",
    onComplete: () => {},
    completeLabel: "Completar",
  },
};

export const Overdue: Story = {
  args: {
    icon: <Droplets className="w-4 h-4" />,
    iconVariant: "sky",
    overdue: true,
    onComplete: () => {},
    completeLabel: "Completar",
  },
};
