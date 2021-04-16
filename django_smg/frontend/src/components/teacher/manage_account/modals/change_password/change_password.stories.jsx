import React from "react";

import { Blanket } from "Common/blanket";

import { ChangePassword } from "./change_password";

export default {
  title: "Modals/Manage Account/Change Password",
  component: ChangePassword,
};

const Template = (args) => (
  <Blanket>
    <ChangePassword
      changePassword={(uid, curPass, newPass) =>
        console.log(
          `Changed password for user id ${uid} from ${curPass} to ${newPass}`
        )
      }
      userId={args.userId}
    />
  </Blanket>
);

export const Default = Template.bind({});
Default.args = {
  userId: 1,
};
