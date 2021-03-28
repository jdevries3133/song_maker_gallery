import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import {
  login as loginAction,
  clearError,
  tryToken,
} from "../../../actions/auth.action";
import { getUserGalleries } from "../../../actions/user";
import { Redirect } from "react-router-dom";

import { Div } from "../../common/styles";
import { ErrorHandler } from "./error_handler";
import { LoginFooter } from "./login_footer";
import { LoginForm } from "./form";

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
    <Div>
      <ErrorHandler err={props.authError} />
      <h1>login!</h1>
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
