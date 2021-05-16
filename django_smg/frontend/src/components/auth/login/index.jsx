import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import {
  login as loginAction,
  clearError,
  tryToken,
} from "Actions/auth.action";
import { getUserGalleries } from "Actions/user";
import { Redirect } from "react-router-dom";

import styled, { Div, H1 as DefaultH1 } from "Styles";
import { ErrorHandler } from "./error_handler";
import { LoginFooter } from "./login_footer";
import { LoginForm } from "./form";
import { windowLocation } from "../../../util/window";

const H1 = styled(DefaultH1)`
  margin-bottom: 0;
`;

const login = (props) => {
  const [username, updateUsername] = useState("");
  const [password, updatePassword] = useState("");
  const params = new URLSearchParams(windowLocation("search"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      props.tryToken(token);
    }
  }, []);

  if (props.isAuthenticated) {
    return <Redirect to={params.get("next") ?? "/teacher"} />;
  }

  const submit = (e) => {
    e.preventDefault();
    props.loginAction({ username: username, password: password });
  };

  return (
    <Div>
      <ErrorHandler err={props.authError} />
      <H1>login!</H1>
      <LoginForm
        username={(u) => updateUsername(u)}
        password={(p) => updatePassword(p)}
        submit={submit}
      />
      <LoginFooter />
    </Div>
  );
};

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    isAuthenticated: state.auth.isAuthenticated,
    galleries: state.user.galleries,
  };
};

export default connect(mapStateToProps, {
  loginAction,
  clearError,
  getUserGalleries,
  tryToken,
})(login);
