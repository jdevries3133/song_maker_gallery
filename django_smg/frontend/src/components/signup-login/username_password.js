import React, { Fragment } from "react";

import styles from "./signup.module.css";

const username_password = (props) => {
  return (
    <Fragment>
      <h3>Username</h3>
      <input
        className={styles.input}
        onChange={(event) => props.username(event.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            console.log("submitting");
            props.submit();
          }
        }}
      />
      <h3>Password</h3>
      <input
        type="password"
        className={styles.input}
        onChange={(event) => props.password(event.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            console.log("submitting");
            props.submit();
          }
        }}
      />
    </Fragment>
  );
};

export default username_password;
