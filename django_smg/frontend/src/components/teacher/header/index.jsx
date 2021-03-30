import React from "react";
import { connect } from "react-redux";

import { logout } from "../../../actions/auth.action";
import styled, {
  Button as DefaultButton,
  H1 as DefaultH1,
} from "../../common/styles";

const H1 = styled(DefaultH1)`
  margin-top: 4rem;
`;

const StyledLogOutButton = styled(DefaultButton)`
  background-color: salmon;
  position: fixed;
  margin: 0.4rem;
  top: 0;
  right: 0;
`;

const Header = ({ logout, token }) => {
  return (
    <header>
      <H1>Gallery Management Console</H1>
      <StyledLogOutButton
        data-testid="logoutButton"
        onClick={() => {
          logout(token);
        }}
      >
        Log Out
      </StyledLogOutButton>
    </header>
  );
};

export default connect(
  (s) => {
    return { token: s.auth.token };
  },
  { logout: logout }
)(Header);
