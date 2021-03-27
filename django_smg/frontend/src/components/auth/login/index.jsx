import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  login as loginAction,
  clearError,
  tryToken,
} from "../../../actions/auth.action";
import { getUserGalleries } from "../../../actions/user";
import { Link, Redirect } from "react-router-dom";
import { ErrorArray } from "../../common/custom_error";
import UsernamePassword from "./username_password";
import { windowLocation } from "../../../util/window";

import { Button } from "../../common/styles";

const NeedAccount = styled(Button)`
  min-width: 14px;
  background-color: #94c732;
`;

const ForgotPass = styled(Button)`
  min-width: 14px;
  background-color: #00bcd1;
`;

const login = (props) => {
  const [username, updateUsername] = useState("");
  const [password, updatePassword] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      props.tryToken(token);
    }
  }, []);

  if (props.isAuthenticated) {
    return <Redirect to="/teacher" />;
  }

  const submit = (e) => {
    e.preventDefault();
    props.loginAction({ username: username, password: password });
  };

  return (
    <div>
      {props.badCredentials ? (
        <ErrorArray
          header="Bad Credentials"
          message={[
            "Please check that you are using the correct username and password.",
          ]}
          onOk={props.clearError}
        />
      ) : null}
      <h1>login!</h1>
      <div className="description">
        <UsernamePassword
          username={(u) => updateUsername(u)}
          password={(p) => updatePassword(p)}
          submit={submit}
        />
      </div>
      <div>
        <Link to="/signup">
          <NeedAccount>Need an account?</NeedAccount>
        </Link>
        <a href={`${windowLocation("origin")}/accounts/password_reset/`}>
          <ForgotPass>Forgot your password?</ForgotPass>
        </a>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    badCredentials: state.auth.authError,
    isAuthenticated: state.auth.isAuthenticated,
    serverError: null, // implement global server error handling later
    galleries: state.user.galleries,
  };
};

export default connect(mapStateToProps, {
  loginAction,
  clearError,
  getUserGalleries,
  tryToken,
})(login);
