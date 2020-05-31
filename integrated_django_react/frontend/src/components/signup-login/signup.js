import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { register, clearError } from "../../actions/auth.action";
import UsernamePassword from "./username_password";
import CustomError from "../generics/custom_error";
import styles from "./signup.module.css";

const signup = (props) => {
  const [emailInput, updateEmail] = useState("");
  const [usernameInput, updateUsername] = useState("");
  const [passwordInput, updatePassword] = useState("");
  let blanket;

  const onOk = () => props.clearError();

  const submit = () => {
    props.register({
      email: emailInput,
      username: usernameInput,
      password: passwordInput,
    });
  };

  let pass_bool = passwordInput.length >= 8;

  if (props.isAuthenticated) {
    return <Redirect to="/teacher" />;
  } else if (props.authError) {
    blanket = (
      <CustomError
        header="Registration Invalid"
        message={[
          "Your registration detailes were not valid. This may be because",
          "(1) That username has already been taken",
          "(2) That email has already been taken",
          "(3) You supplied an invalid email address.",
          "If there were more hours in the day, I could tell you which it was, but you've got to figure this one out yourself, my friend.",
        ]}
        onOk={onOk}
      />
    );
  }
  return (
    //todo if they click, change pass requirement to red.
    <div>
      {blanket}
      <h1 className={styles.h1_short}>sign up!</h1>
      <Link to="/login">
        <button>Already have an account? Sign in here!</button>
      </Link>
      <br />
      <div className="description">
        <h3>Email</h3>
        <input
          className={styles.input}
          onChange={(event) => updateEmail(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submit();
            }
          }}
        />
        <UsernamePassword
          username={(u) => updateUsername(u)}
          password={(p) => updatePassword(p)}
          submit={submit}
        />
        <div className={styles.passValidator}>
          {pass_bool ? (
            <p className={styles.met}>
              Your password is at least eigth characters long
            </p>
          ) : (
            <p className={styles.not_met}>
              Your password must be at least eight characters long
            </p>
          )}
          <br />
          <button
            onClick={() =>
              props.register({
                email: emailInput,
                username: usernameInput,
                password: passwordInput,
              })
            }
            className={styles.sign_up}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    isAuthenticated: state.auth.isAuthenticated,
  };
};

export default connect(mapStateToProps, { register, clearError })(signup);
