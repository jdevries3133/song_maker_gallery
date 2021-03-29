import React from "react";
import { connect } from "react-redux";

import { logout } from "../../actions/auth.action";
import styled, { Button as DefaultButton, H1, Div } from "../common/styles";

import AddGallery from "./add_gallery";
import ListGalleries from "./list_galleries";

const StyledLogOutButton = styled(DefaultButton)`
  background-color: salmon;
  position: sticky;
  float: right;
  top: 0;
  right: 0;
`;

const TeacherHeader = ({ logout, token }) => {
  return (
    <>
      <H1>Gallery Management Console</H1>
      <StyledLogOutButton
        data-testid="logoutButton"
        onClick={() => {
          logout(token);
        }}
      >
        Log Out
      </StyledLogOutButton>
    </>
  );
};

const Teacher = ({ token, logout }) => {
  return (
    <Div>
      <TeacherHeader {...{ token, logout }} />
      <AddGallery />
      <ListGalleries />
    </Div>
  );
};

export default connect(
  (s) => {
    return { token: s.auth.token };
  },
  { logout: logout }
)(Teacher);
