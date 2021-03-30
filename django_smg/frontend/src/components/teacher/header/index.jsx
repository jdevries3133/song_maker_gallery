import React from "react";

import LogoutButton from "./logout_button";

import styled, { H1 as DefaultH1 } from "../../common/styles";

const H1 = styled(DefaultH1)`
  margin-top: 4rem;
`;

export default ({ logout, token }) => {
  return (
    <header>
      <H1>Gallery Management Console</H1>
      <LogoutButton />
    </header>
  );
};
