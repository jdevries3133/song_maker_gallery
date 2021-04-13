import React from "react";

import { GalleryConfig } from "./gallery_config";

export default {
  title: "Teacher/Gallery Config",
  component: GalleryConfig,
};

const Template = (args) => <GalleryConfig {...args} />;

export const Default = Template.bind({});
Template.args = {};
