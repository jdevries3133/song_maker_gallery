import React from "react";

import { FallbackTile } from "./fallback_tile";

export default {
  title: "Common/Song Tiles/Fallback",
  component: FallbackTile,
};

const Template = (args) => <FallbackTile {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: "Fred",
  width: 600,
};
