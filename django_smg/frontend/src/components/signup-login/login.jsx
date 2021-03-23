import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  login as loginAction,
  clearError,
  tryToken,
} from "../../actions/auth.action";
import { getUserGalleries } from "../../actions/user";
import { Link, Redirect } from "react-router-dom";
import { ErrorArray } from "../generics/custom_error";
import UsernamePassword from "./username_password";
import styles from "./signup.module.css";
import { windowLocation } from "../../util/window";

const login = (props) => {
  const [username, updateUsername] = useState("");
  const [password, updatePassword] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    document.title = props.title;
    if (token) {
      props.tryToken(token);
    }
  }, []);

  if (props.isAuthenticated) {
    return <Redirect to="/teacher" />;
  }

  const submit = () => {
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
        <div className={styles.loginButtonSpace}>
          <button data-testid="loginSubmit" onClick={() => submit()}>
            Login
          </button>
        </div>
      </div>
      <br />
      <Link to="/signup">
        <button className={styles.col_1}>Need an account?</button>
      </Link>
      <a href={`${windowLocation("origin")}/accounts/password_reset/`}>
        <button className={styles.col_2}>Forgot your password?</button>
      </a>
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
