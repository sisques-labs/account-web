import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "./form-field";

const meta = {
  title: "UI/FormField",
  component: FormField,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    error: { control: "text" },
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Nombre de la planta",
    children: (
      <input
        placeholder="Ej: Tomate Cherry"
        style={{
          width: "100%",
          padding: "8px 12px",
          border: "1px solid var(--rule)",
          borderRadius: 6,
          fontSize: 13,
          fontFamily: "var(--sans)",
          background: "var(--paper)",
          outline: "none",
        }}
      />
    ),
  },
};

export const WithError: Story = {
  args: {
    label: "Nombre de la planta",
    error: "Este campo es obligatorio",
    children: (
      <input
        placeholder="Ej: Tomate Cherry"
        style={{
          width: "100%",
          padding: "8px 12px",
          border: "1px solid var(--terracotta)",
          borderRadius: 6,
          fontSize: 13,
          fontFamily: "var(--sans)",
          background: "var(--paper)",
          outline: "none",
        }}
      />
    ),
  },
};

export const WithSelect: Story = {
  args: {
    label: "Temporada de siembra",
    children: (
      <select
        style={{
          width: "100%",
          padding: "8px 12px",
          border: "1px solid var(--rule)",
          borderRadius: 6,
          fontSize: 13,
          fontFamily: "var(--sans)",
          background: "var(--paper)",
          outline: "none",
        }}
      >
        <option>Primavera</option>
        <option>Verano</option>
        <option>Otoño</option>
        <option>Invierno</option>
      </select>
    ),
  },
};
