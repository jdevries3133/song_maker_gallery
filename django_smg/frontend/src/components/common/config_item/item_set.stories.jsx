import React, { useState } from "react";

import { ConfigItemSet } from "./item_set";
import { ConfigItem } from "./config_item";

export default {
  title: "Common/Config Item/Item Set",
};

const Template = ({ checked }) => {
  const [_checked, setChecked] = useState(checked);
  return (
    <ConfigItemSet>
      <ConfigItem
        id="Main Thing"
        label="Main Thing"
        checked={_checked}
        onChange={() => setChecked(!_checked)}
      >
        All children are dependent on this.
      </ConfigItem>
      <ConfigItem id="dependent" label="Disabled if parent is" />
      <ConfigItem id="alsoDependent" label="Also dependent" checked={false} />
    </ConfigItemSet>
  );
};

export const ParentEnabled = Template.bind({});
ParentEnabled.args = {
  checked: true,
};

export const ParentDiabled = Template.bind({});
ParentDiabled.args = {
  checked: false,
};
