import React, { useState } from "react";
import { connect } from "react-redux";
import { login as loginAction } from "../../actions/auth.action";
import { register, clearError } from "../../actions/auth.action";
import CustomError from "../generics/custom_error";
import UsernamePassword from "./username_password";
import styles from "./signup.module.css";

const login = (props) => {
  const [username, updateUsername] = useState("");
  const [password, updatePassword] = useState("");

  return (
    <div>
      {props.badCredentials ? (
        <CustomError
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
        />
        <div className={styles.loginButtonSpace}>
          <button
            onClick={() =>
              props.loginAction({ username: username, password: password })
            }
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    badCredentials: state.auth.authError,
    serverError: null, // implement global server error handling later
  };
};

export default connect(mapStateToProps, { loginAction, clearError })(login);
