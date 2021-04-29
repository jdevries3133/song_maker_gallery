import React from "react";

import { GalleryForm } from "./gallery_form";
import testData from "Test/test_data";
export default {
  title: "Teacher/Gallery Form",
  component: GalleryForm,
};

const Template = (args) => <GalleryForm {...args} />;

export const Default = Template.bind({});
Default.args = testData;
