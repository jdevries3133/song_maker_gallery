import React from "react";
import styled, { P } from "../../common/styles";

import { PASSWD_MIN_LENGTH } from "./index";

const Li = ({ children, ...rest }) => (
  <P as="li" {...rest}>
    {children}
  </P>
);

const StyledValidationMessages = styled.ul`
  list-style-type: none;
  background-color: #adff1626;
  border-radius: 20px;
  padding: 1em;
`;

export const ValidationMessages = ({
  usernameInput,
  passwordInput,
  passwordConfirm,
}) => {
  return (
    <StyledValidationMessages>
      {passwordInput !== passwordConfirm ? (
        <Li warn>Passwords do not match</Li>
      ) : passwordInput.length > 0 ? (
        <Li confirm>Passwords match</Li>
      ) : null}

      {usernameInput.includes(" ") ? (
        <Li warn>Username may not contain spaces.</Li>
      ) : (
        <Li confirm>Username does not contain any spaces</Li>
      )}

      {passwordInput.length >= PASSWD_MIN_LENGTH ? (
        <Li confirm>Your password is at least eight characters long</Li>
      ) : (
        <Li>Your password must be at least eight characters long</Li>
      )}
    </StyledValidationMessages>
  );
};
