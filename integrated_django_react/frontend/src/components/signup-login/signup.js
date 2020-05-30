import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { register } from "../../actions/auth.action";
import UsernamePassword from "./username_password";
import styles from "./signup.module.css";

const signup = (props) => {
  const [emailInput, updateEmail] = useState("");
  const [usernameInput, updateUsername] = useState("");
  const [passwordInput, updatePassword] = useState("");

  let pass_bool = passwordInput.length >= 8;

  //todo if they click, change pass requirement to red.

  return (
    <div>
      <h1 className={styles.h1_short}>sign up!</h1>
      <Link to="/register">
        <button>Already have an account? Sign in here!</button>
      </Link>
      <br />
      <div className="description">
        <h3>Email</h3>
        <input
          className={styles.input}
          onChange={(event) => updateEmail(event.target.value)}
        />
        <UsernamePassword
          username={(u) => updateUsername(u)}
          password={(p) => updatePassword(p)}
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
          <Link to="/teacher">
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
          </Link>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { register })(signup);
