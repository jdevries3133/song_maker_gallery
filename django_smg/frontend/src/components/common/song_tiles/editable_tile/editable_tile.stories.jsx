import React from "react";

import { BackendDependentStory } from "Common/storybook_util";

import { EditableTile } from "./editable_tile";

export default {
  title: "Common/Song Tiles/Editable Tile",
  component: EditableTile,
};

const Template = (args) => (
  <BackendDependentStory>
    <EditableTile {...args} />
  </BackendDependentStory>
);

export const Default = Template.bind({});
Default.args = {
  name: "Frankie",
  link:
    "https://musiclab.chromeexperiments.com/Song-Maker/song/6594803161104384",
};
