import React from "react";

import { BackendDependentStory } from "Common/storybook_util";
import testData from "Test/test_data";

import { GalleryForm } from "./gallery_form";

export default {
  title: "Teacher/Gallery Form",
  component: GalleryForm,
};

const Template = (args) => (
  <BackendDependentStory>
    <GalleryForm {...args} />
  </BackendDependentStory>
);

export const Default = Template.bind({});
Default.args = { gallery: testData };
