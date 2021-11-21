import React from "react";

import { Home } from "./index";
import { Context as Cx } from "Common/storybook_util";

export default {
  title: "teacher/Teacher Home Cards",
  component: Home,
};

const Template = (args) => (
  <Cx>
    <Home {...args} />
  </Cx>
);

export const Default = Template.bind({});
Default.args = {};
