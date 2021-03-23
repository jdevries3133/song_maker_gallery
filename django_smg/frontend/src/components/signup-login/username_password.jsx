import React, { Fragment } from "react";

const username_password = (props) => {
  return (
    <Fragment>
      <h3>Username</h3>
      <input
        data-testid="usernameInput"
        onChange={(event) => props.username(event.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            props.submit();
          }
        }}
      />
      <h3>Password</h3>
      <input
        data-testid="passwordInput"
        type="password"
        onChange={(event) => props.password(event.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            props.submit();
          }
        }}
      />
    </Fragment>
  );
};

export default username_password;
