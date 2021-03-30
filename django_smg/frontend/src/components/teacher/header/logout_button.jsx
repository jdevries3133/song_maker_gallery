import React from "react";
import { connect } from "react-redux";

import { logout } from "Actions/auth.action";
import styled, { Button as DefaultButton } from "Styles";

const StyledLogOutButton = styled(DefaultButton)`
  background-color: salmon;
  position: fixed;
  margin: 0.4rem;
  top: 0;
  right: 0;
`;

const LogoutButton = ({ token, logout }) => (
  <StyledLogOutButton
    data-testid="logoutButton"
    onClick={() => {
      logout(token);
    }}
  >
    Log Out
  </StyledLogOutButton>
);

export default connect(
  (s) => {
    return { token: s.auth.token };
  },
  { logout: logout }
)(LogoutButton);
