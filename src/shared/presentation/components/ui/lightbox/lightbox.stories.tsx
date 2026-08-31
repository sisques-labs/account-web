import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORY_PLANT_IMAGE, STORY_PLANT_IMAGE_ALT } from "../../../../../../.storybook/fixtures/images";
import { Button } from "../button/button";
import { Lightbox } from "./lightbox";

const photos = [
  { src: STORY_PLANT_IMAGE, alt: "Monstera leaf" },
  { src: STORY_PLANT_IMAGE_ALT, alt: "Pothos vine" },
];

const meta: Meta = {
  title: "Media/Lightbox",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

function LightboxDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open lightbox</Button>
      <Lightbox photos={photos} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export const Default: Story = { render: () => <LightboxDemo /> };

const photosWithCaption = [
  { src: STORY_PLANT_IMAGE, alt: "Monstera leaf", caption: "Uploaded on Mar 12" },
  { src: STORY_PLANT_IMAGE_ALT, alt: "Pothos vine", caption: "Uploaded on Feb 3" },
];

function LightboxWithCaptionDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open lightbox</Button>
      <Lightbox photos={photosWithCaption} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export const WithCaption: Story = { render: () => <LightboxWithCaptionDemo /> };
