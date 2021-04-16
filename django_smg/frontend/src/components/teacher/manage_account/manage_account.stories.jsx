import React from "react";

import { Context as C } from "Test/app_context";

import { ManageAccount } from "./manage_account";

const Template = (args) => (
  <C>
    <ManageAccount {...args} />
  </C>
);

export default {
  title: "teacher/Manage Account",
  component: ManageAccount,
};

export const Default = Template.bind({});
Default.args = {};
