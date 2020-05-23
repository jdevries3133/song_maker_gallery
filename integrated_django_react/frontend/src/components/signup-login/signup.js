import React, { useState } from "react";

import UsernamePassword from "./username_password";
import styles from "./signup.module.css";

const signup = (props) => {
  const [password, updatePassword] = useState("");
  const [username, updateUsername] = useState("");

  let pass_bool = password.length >= 8;

  //todo if they click, change pass requirement to red.

  return (
    <div>
      <h1>sign up!</h1>
      <br />
      <button>Already have an account? Sign in here!</button>
      <br />
      <div className="description">
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
          <button className={styles.sign_up}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default signup;
