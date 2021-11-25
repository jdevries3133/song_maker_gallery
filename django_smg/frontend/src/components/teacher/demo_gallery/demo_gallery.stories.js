import React from "react";

import { DemoGallery } from "./demo_gallery";
import testData from "Test/test_data";

export default {
  title: "Teacher/Demo Gallery",
  component: DemoGallery,
};

const Template = (args) => <DemoGallery {...args} />;
export const Default = Template.bind({});
Default.args = { gallery: testData };
