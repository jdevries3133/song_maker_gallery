import React from "react";
import { Label } from "../../common/styles";

const username_password = ({ username, password, submit }) => {
  return (
    <form onSubmit={submit}>
      <div>
        <Label htmlFor="username">Username</Label>
        <input
          id="username"
          data-testid="usernameInput"
          onChange={(event) => username(event.target.value)}
        />
        <Label htmlFor="password">Password</Label>
        <input
          id="password"
          data-testid="passwordInput"
          type="password"
          onChange={(event) => password(event.target.value)}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <button data-testid="loginSubmit" onClick={submit}>
          Login
        </button>
      </div>
    </form>
  );
};

export default username_password;
