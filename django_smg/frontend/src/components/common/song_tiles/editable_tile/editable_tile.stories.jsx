import React from "react";

import { EditableTile } from "./editable_tile";

export default {
  title: "Common/Song Tiles/Editable Tile",
  component: EditableTile,
};

const Template = (args) => <EditableTile {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: "Frankie",
  link:
    "https://musiclab.chromeexperiments.com/Song-Maker/song/6594803161104384",
};
