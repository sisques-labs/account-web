import type { Meta, StoryObj } from "@storybook/react";
import { STORY_PLANT_IMAGE, STORY_PLANT_IMAGE_ALT } from "../../../../../../.storybook/fixtures/images";
import { Button } from "../button/button";
import { MediaCard } from "./media-card";

const meta = {
  title: "Media/MediaCard",
  component: MediaCard,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["vertical", "horizontal"] },
  },
} satisfies Meta<typeof MediaCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  args: {
    variant: "vertical",
    src: STORY_PLANT_IMAGE,
    alt: "Monstera",
    title: "Monstera deliciosa",
    description: "Swiss cheese plant in the living room.",
    className: "w-64",
  },
};
export const Horizontal: Story = {
  args: {
    variant: "horizontal",
    src: STORY_PLANT_IMAGE_ALT,
    alt: "Pothos",
    title: "Golden Pothos",
    description: "Trailing vine on the bookshelf.",
    actions: <Button size="sm" variant="outline">View</Button>,
    className: "w-96",
  },
};
