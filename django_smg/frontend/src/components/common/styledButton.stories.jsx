import React from "react";
import { Button } from "Styles";

export default {
  title: "Button",
  component: Button,
};

const Template = (args) => <Button {...args}>{args.text}</Button>;

export const Normal = Template.bind({});
Normal.args = { text: "Click Me" };

export const CloseButton = Template.bind({});
CloseButton.args = {
  text: "Close",
  blanketClose: true,
};

export const Green = Template.bind({});
Green.args = {
  text: "Green",
  color: "green",
};

export const Blue = Template.bind({});
Blue.args = {
  text: "Ligt Blue",
  color: "cadetblue",
};
