import React from "react";

import { Context } from "Common/storybook_util";

import { DemoGallery } from "./demo_gallery";
import testData from "Test/test_data";

export default {
  title: "Teacher/Demo Gallery",
  component: DemoGallery,
};

const Template = (args) => (
  <Context>
    <DemoGallery {...args} />
  </Context>
);
export const Default = Template.bind({});
Default.args = { gallery: testData };
