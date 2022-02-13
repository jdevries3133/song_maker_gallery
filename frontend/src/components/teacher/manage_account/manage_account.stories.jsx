import React from "react";

import { ManageAccount } from "./manage_account";

const Template = (args) => <ManageAccount {...args} />;

export default {
  title: "teacher/Manage Account",
  component: ManageAccount,
};

export const Default = Template.bind({});
Default.args = {};
