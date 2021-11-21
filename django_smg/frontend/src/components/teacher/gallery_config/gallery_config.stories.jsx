import React from "react";

import { GalleryConfig } from "./gallery_config";
import { Context as Ctx } from "Common/storybook_util";

export default {
  title: "Teacher/Gallery Config",
  component: GalleryConfig,
};

const Template = (args) => (
  <Ctx>
    <GalleryConfig {...args} />
  </Ctx>
);

export const Default = Template.bind({});
Template.args = {};
