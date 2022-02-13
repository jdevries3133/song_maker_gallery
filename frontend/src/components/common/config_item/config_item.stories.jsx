import React from "react";

import { ConfigItem } from "./config_item";

export default {
  title: "Common/Config Item/Config Item",
};

const Template = (args) => <ConfigItem {...args} />;

export const Single = Template.bind({});
Single.args = {
  id: "example",
  label: "Example Item",
  checked: true,
  onChange: () => console.log("checked"),
  children: "Additional information passed as children",
};

const ManyTemplate = (args) => args.items.map((i) => <ConfigItem {...i} />);

export const Many = ManyTemplate.bind({});
Many.args = {
  items: [
    {
      id: "example",
      label: "Example Item",
      checked: true,
      onChange: () => console.log("checked #1"),
      children: "Additional information passed as children",
    },
    {
      id: "example2",
      label: "Example Item #2",
      checked: false,
      onChange: () => console.log("checked #2"),
      children: "More information goes here",
    },
    {
      id: "example3",
      label: "Example Item #3",
      checked: true,
      onChange: () => console.log("checked #3"),
      children: "Last thing goes here",
    },
  ],
};
