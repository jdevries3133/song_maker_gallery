import React from "react";

import { useModals } from "Common/useModals";

import { ChangeEmail, ChangePassword, DeleteAccount } from "./modals";
import styled, { Button, Description } from "Styles";

const Container = styled(Description)`
  display: flex;
  gap: 0.6rem;
  flex-direction: column;
  align-items: flex-start;
  max-width: 380px;
`;

export const ManageAccount = () => {
  const [modals, dispatchModal] = useModals({
    modals: [
      {
        name: "email",
        show: () => <ChangeEmail />,
      },
      {
        name: "password",
        show: () => <ChangePassword />,
      },
      {
        name: "delete",
        show: () => <DeleteAccount />,
      },
    ],
  });

  return (
    <Container>
      {modals}
      <h1>Your Account</h1>
      <Button color="#94c732" onClick={() => dispatchModal("email")}>
        Change Email
      </Button>
      <Button color="#ffe715" onClick={() => dispatchModal("password")}>
        Change Password
      </Button>
      <Button color="#ff6b60" onClick={() => dispatchModal("delete")}>
        Delete Your Account
      </Button>
    </Container>
  );
};
