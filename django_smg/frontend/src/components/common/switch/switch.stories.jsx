import React from "react";
import { Switch } from "./switch";

export default {
  title: "Common/Switch",
  component: Switch,
};

const Template = (args) => <Switch {...args} />;

export const On = Template.bind({});
On.args = {
  checked: true,
  id: "defaultOn",
};

export const Off = Template.bind({});
Off.args = {
  checked: false,
  id: "defaultOff",
};
