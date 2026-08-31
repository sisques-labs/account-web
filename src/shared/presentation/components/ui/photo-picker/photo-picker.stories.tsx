import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  STORY_PLANT_IMAGE,
  STORY_PLANT_IMAGE_3,
  STORY_PLANT_IMAGE_ALT,
} from "../../../../../../.storybook/fixtures/images";
import { PhotoPicker } from "./photo-picker";

const photos = [
  { src: STORY_PLANT_IMAGE, alt: "Photo 1" },
  { src: STORY_PLANT_IMAGE_ALT, alt: "Photo 2" },
  { src: STORY_PLANT_IMAGE_3, alt: "Photo 3" },
];

const meta = {
  title: "Media/PhotoPicker",
  component: PhotoPicker,
  tags: ["autodocs"],
} satisfies Meta<typeof PhotoPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledPicker() {
  const [selected, setSelected] = React.useState<number[]>([0]);
  return (
    <PhotoPicker
      photos={photos}
      mode="multiple"
      selected={selected}
      onSelectionChange={setSelected}
    />
  );
}

export const Single: Story = { args: { photos, mode: "single", selected: [1] } };
export const Multiple: Story = {
  args: { photos, mode: "multiple", selected: [0] },
  render: () => <ControlledPicker />,
};
