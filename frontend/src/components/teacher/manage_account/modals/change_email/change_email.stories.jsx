import React from "react";
import { Blanket } from "Common/blanket";

import { ChangeEmail } from "./change_email";

export default {
  title: "Modals/Manage Account/Change Email",
  component: ChangeEmail,
};

const Template = (args) => (
  <Blanket>
    <ChangeEmail
      changeEmail={(eml, usr, token) =>
        console.log(
          `Changed email for user ${usr} to ${eml} with token ${token}`
        )
      }
      userId={args.userId}
      token={args.token}
    />
  </Blanket>
);

export const Default = Template.bind({});
Default.args = {
  userId: 1,
  token: "testtoken",
};
