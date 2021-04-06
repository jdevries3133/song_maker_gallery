import React from "react";
import { Button } from "Styles";

export default {
  title: "Button",
  component: Button,
};

const Template = (args) => <Button {...args}>{args.children}</Button>;

export const Normal = Template.bind({});
Normal.args = { children: "Click Me" };

export const Green = Template.bind({});
Green.args = {
  children: "Green",
  color: "green",
};

export const Blue = Template.bind({});
Blue.args = {
  children: "Light Blue",
  color: "cadetblue",
};
