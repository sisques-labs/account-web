import type { Meta, StoryObj } from "@storybook/react";
import { FormModal } from "./form-modal";
import { Input } from "@/shared/presentation/components/ui/input/input";

const meta = {
  title: "Overlays/FormModal",
  component: FormModal,
  tags: ["autodocs"],
  args: {
    title: "Nueva cosecha",
    onClose: () => {},
    onSubmit: (e) => e.preventDefault(),
    isPending: false,
    cancelLabel: "Cancelar",
    submitLabel: "Guardar",
    submittingLabel: "Guardando...",
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <label style={{ fontSize: 13, color: "var(--ink-2)" }}>Cultivo</label>
        <Input placeholder="Tomate" />
      </div>
    ),
  },
} satisfies Meta<typeof FormModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pending: Story = {
  args: { isPending: true },
};

export const WithBeforeFormSlot: Story = {
  args: {
    maxWidth: "sm",
    beforeForm: <p style={{ fontSize: 13, color: "var(--ink-3)" }}>Cantidad actual: 5 kg</p>,
  },
};
