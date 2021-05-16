import React from "react";

import { Context, BackendDependentStory } from "Common/storybook_util";
import testData from "Test/test_data";

import { GalleryForm } from "./gallery_form";

export default {
  title: "Teacher/Gallery Form",
  component: GalleryForm,
};

const Template = (args) => (
  <Context>
    <BackendDependentStory>
      <GalleryForm {...args} />
    </BackendDependentStory>
  </Context>
);

export const Default = Template.bind({});
Default.args = { gallery: testData };
