import React from "react";
import { Div, Button, Description, Input, Label } from "Styles";

export const LoginForm = ({ username, password, submit }) => {
  return (
    <Description as="form" onSubmit={submit}>
      <Div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          autoComplete="username"
          data-testid="usernameInput"
          onChange={(event) => username(event.target.value)}
        />
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          autoComplete="current-password"
          data-testid="passwordInput"
          type="password"
          onChange={(event) => password(event.target.value)}
        />
      </Div>
      <Div style={{ marginTop: "20px" }}>
        <Button data-testid="loginSubmit" onClick={submit}>
          Login
        </Button>
      </Div>
    </Description>
  );
};
