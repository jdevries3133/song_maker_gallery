import React from "react";
import { Switch } from "./switch";

export default {
  title: "Common/Switch",
  component: Switch,
};

const Template = (args) => <Switch {...args} />;

export const On = Template.bind({});
On.args = {
  labelText: "Default Enabled Value",
  checked: true,
  id: "defaultOn",
};

export const Off = Template.bind({});
Off.args = {
  labelText: "Default Disabled Value",
  checked: false,
  id: "defaultOff",
};
