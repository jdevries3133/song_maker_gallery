import React from "react";
import styled, { Button } from "Styles";
import { Link as DefaultLink } from "react-router-dom";
import { windowLocation } from "../../../util/window";

const Footer = styled.footer`
  width: 100%;
  text-align: center;
`;

const NeedAccount = styled(Button)`
  display: block;
  margin: auto;
  margin-bottom: 1.5rem;
  min-width: 14px;
  background-color: #94c732;
  text-decoration: none;
`;

const ForgotPass = styled(Button)`
  display: block;
  margin: auto;
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
  <Footer>
    <Link to="/signup">
      <NeedAccount>Need an account?</NeedAccount>
    </Link>
    <A href={`${windowLocation("origin")}/accounts/password_reset/`}>
      <ForgotPass>Forgot your password?</ForgotPass>
    </A>
  </Footer>
);
