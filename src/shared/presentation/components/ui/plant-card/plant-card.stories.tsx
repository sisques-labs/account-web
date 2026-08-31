import type { Meta, StoryObj } from "@storybook/react";
import { STORY_PLANT_IMAGE } from "../../../../../../.storybook/fixtures/images";
import { PlantCard } from "./plant-card";

const meta = {
  title: "UI/PlantCard",
  component: PlantCard,
  tags: ["autodocs"],
} satisfies Meta<typeof PlantCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Monstera deliciosa",
    species: "Araceae",
    status: "Healthy",
    imageUrl: STORY_PLANT_IMAGE,
    className: "w-64",
  },
};
export const WithoutImage: Story = {
  args: { name: "Snake Plant", species: "Dracaena trifasciata", status: "Needs water", className: "w-64" },
};
