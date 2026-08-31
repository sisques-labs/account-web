import type { Meta, StoryObj } from "@storybook/react";
import {
  STORY_PLANT_IMAGE,
  STORY_PLANT_IMAGE_3,
  STORY_PLANT_IMAGE_4,
  STORY_PLANT_IMAGE_ALT,
} from "../../../../../../.storybook/fixtures/images";
import { PhotoGrid } from "./photo-grid";

const photos = [
  { src: STORY_PLANT_IMAGE, alt: "Monstera leaf" },
  { src: STORY_PLANT_IMAGE_ALT, alt: "Pothos vine" },
  { src: STORY_PLANT_IMAGE_3, alt: "Fern fronds" },
  { src: STORY_PLANT_IMAGE_4, alt: "Succulent" },
];

const meta = {
  title: "Media/PhotoGrid",
  component: PhotoGrid,
  tags: ["autodocs"],
} satisfies Meta<typeof PhotoGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { photos, columns: 3, className: "max-w-lg" } };
