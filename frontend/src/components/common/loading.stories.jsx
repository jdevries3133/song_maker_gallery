import React from "react";
import Spinner from "./loading";

export default {
  title: "Common/Loading Spinner",
  component: Spinner,
};

const Template = (args) => (
  <div style={{ backgroundColor: args.dark ? "white" : "black" }}>
    <Spinner {...args} />
  </div>
);

export const Light = Template.bind({});
Light.args = {};

export const Dark = Template.bind({});
Dark.args = { dark: "defined" };
