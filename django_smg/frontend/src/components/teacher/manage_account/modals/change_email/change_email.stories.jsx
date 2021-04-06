import React from "react";
import { Blanket } from "Common/blanket";

import { ChangeEmail } from "./change_email";

export default {
  title: "Modals/Manage Account/Change Email",
  component: ChangeEmail,
};

const Template = (args) => (
  <Blanket>
    <ChangeEmail {...args} />
  </Blanket>
);

export const Default = () => <ChangeEmail />;
