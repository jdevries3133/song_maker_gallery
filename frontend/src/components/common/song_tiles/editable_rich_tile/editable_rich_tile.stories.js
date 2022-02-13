import React from "react";

import { EditableRichTile } from "./editable_rich_tile";

export default {
  title: "Common/Song Tiles/Editable Rich Tile",
  component: EditableRichTile,
};

const Template = (args) => <EditableRichTile {...args} />;

export const Default = Template.bind({});

Default.args = {
  title: "New title",
  description: "description",
};
