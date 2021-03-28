import React from "react";
import styled, { Button } from "../../common/styles";
import { Link as DefaultLink } from "react-router-dom";
import { windowLocation } from "../../../util/window";

const NeedAccount = styled(Button)`
  display: block;
  min-width: 14px;
  background-color: #94c732;
  text-decoration: none;
`;

const ForgotPass = styled(Button)`
  display: block;
  min-width: 14px;
  background-color: #00bcd1;
  text-decoration: none;
`;

const A = styled.a`
  text-decoration: none;
`;

const Link = styled(DefaultLink)`
  text-decoration: none;
`;

export const LoginFooter = () => (
  <div>
    <Link to="/signup">
      <NeedAccount>Need an account?</NeedAccount>
    </Link>
    <A href={`${windowLocation("origin")}/accounts/password_reset/`}>
      <ForgotPass>Forgot your password?</ForgotPass>
    </A>
  </div>
);
