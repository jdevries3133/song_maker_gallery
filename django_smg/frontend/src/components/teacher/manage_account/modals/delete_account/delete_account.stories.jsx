import React from "react";
import { Blanket } from "Common/blanket";

import { DeleteAccount } from "./delete_account";

export default {
  title: "Modals/Manage Account/Delete Account",
  component: DeleteAccount,
};

const Template = (args) => (
  <Blanket>
    <DeleteAccount
      deleteAccount={(id, passwd) =>
        console.log(
          `Deleted account for user with id ${id} using password ${passwd}`
        )
      }
      userId={args.userId}
      deleteAccount={(id, pass) =>
        console.log(`Deleted account id ${id} using credentials ${pass}`)
      }
    />
  </Blanket>
);

export const Default = Template.bind({});
Default.args = {
  userId: 1,
};
