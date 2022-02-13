import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { logout } from "Actions/auth.action";
import styled, { Button } from "Styles";

const Tools = styled.header`
  display: block;
  background-color: #eee;
  opacity: 50;
  padding-bottom: 10px 0;
  width: 100%;
  z-index: 10;
  top: 0;
  right: 0;

  & > button {
    margin: 0 10px;
  }
`;

export const _Nav = ({ token, logout }) => {
  return (
    <Tools>
      <Link to="/teacher">
        <Button>Teacher Home Page</Button>
        <Button
          color="salmon"
          data-testid="logoutButton"
          onClick={() => {
            logout(token);
          }}
        >
          Log Out
        </Button>
      </Link>
    </Tools>
  );
};

export const Nav = connect(
  (s) => {
    return { token: s.auth.token };
  },
  { logout: logout }
)(_Nav);
