import React from "react";

import { ConfigItemSet } from "./item_set";
import { ConfigItem } from "./config_item";

export default {
  title: "Common/Config Item/Config Item Set",
};

const Template = ({ checked }) => (
  <ConfigItemSet>
    <ConfigItem id="Main Thing" label="Main Thing" checked={checked}>
      All children are dependent on this
    </ConfigItem>
    <ConfigItem id="dependent" label="Disabled if parent is" />
    <ConfigItem id="alsoDependent" label="Also dependent" checked={false} />
  </ConfigItemSet>
);

export const ParentEnabled = Template.bind({});
ParentEnabled.args = {
  checked: true,
};

export const ParentDiabled = Template.bind({});
ParentDiabled.args = {
  checked: false,
};
