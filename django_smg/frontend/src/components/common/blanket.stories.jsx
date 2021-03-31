import React from "react";
import { H2, P } from "Styles";
import { Blanket } from "./blanket";

export default {
  title: "Blanket",
  component: Blanket,
};

const Template = (args) => <Blanket {...args}></Blanket>;

export const Default = Template.bind({});
