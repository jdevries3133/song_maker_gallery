import React from "react";
import { Blanket } from "Common/blanket";

import { ManageAccount } from "./manage_account";
import { ChangeEmail } from "./modals";

const Template = (args) => <ManageAccount {...args} />;

export default {
  title: "teacher/Manage Account",
  component: ManageAccount,
};

export const Default = Template.bind({});
Default.args = {};
