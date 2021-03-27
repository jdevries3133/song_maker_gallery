import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { register, clearError } from "../../../actions/auth.action";
import styled, {
  P,
  Button,
  Label,
  Checkbox,
  Description,
} from "../../common/styles";
import { ErrorArray } from "../../common/custom_error";
import { Tos, Privacy } from "../../legal";

import { ValidationMessages } from "./validation_messages";

export const PASSWD_MIN_LENGTH = 9;

// subtle adjust to align text with checkbox
const SpanCbAligned = styled.span`
  position: relative;
  bottom: 8px;
`;

const Header = styled.h1`
  margin: 0rem;
  font-size: 60px;
`;

const FlexForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 3rem;
`;

const SubmitButton = styled(Button)`
  font-size: 24px;
  height: auto;
  line-height: 40px;
  padding: 10px 5px 10px 5px;
  background-color: lightseagreen;
`;

const signup = (props) => {
  const [emailInput, updateEmail] = useState("");
  const [usernameInput, updateUsername] = useState("");
  const [passwordInput, updatePassword] = useState("");
  const [passwordConfirm, updateConfirm] = useState("");
  const [blanket, setBlanket] = useState(null);
  const clearBlanket = () => setBlanket(null);
  const [TOS, setTOS] = useState(false);

  useEffect(() => {
    document.title = props.title;
  }, []);

  /**
   * Validate form and inject a modal warning into "blanket" if it is not
   * valid. Checks for the following:
   *
   * - All fields are filled
   * - Password and confirm password are the same
   * - Terms of service box has been checked
   *
   * @returns {bool} whether form is valid
   */
  const validate = () => {
    if (
      emailInput === "" ||
      usernameInput === "" ||
      passwordInput === "" ||
      passwordConfirm === ""
    ) {
      setBlanket(
        <ErrorArray
          header="Blank Fields"
          message={["Required fields are blank", "All fields are required."]}
          onOk={clearBlanket}
        />
      );
      return false;
    }
    if (passwordInput !== passwordConfirm) {
      setBlanket(
        <ErrorArray
          header="Passwords do not match"
          message={[""]}
          onOk={clearBlanket}
        />
      );
      return false;
    }
    if (!TOS) {
      setBlanket(
        <ErrorArray
          header="Terms of Service"
          message={["You must accept the terms of service to make an account"]}
          onOk={clearBlanket}
        />
      );
      return false;
    }
    return true;
  };

  const submit = (e) => {
    e.preventDefault();
    if (validate()) {
      props.register({
        email: emailInput,
        username: usernameInput,
        password: passwordInput,
      });
    }
  };

  if (props.isAuthenticated) {
    return <Redirect to="/teacher" />;
  } else if (props.authError && !blanket) {
    const errors = Object.keys(props.authError).map(
      (k) => `${k}: ${props.authError[k]}`
    );
    setBlanket(
      <ErrorArray
        onOk={() => {
          props.clearError();
          clearBlanket();
        }}
        header="Validation Error"
        message={errors}
      />
    );
  }

  return (
    <div>
      {blanket}
      <Header>sign up!</Header>
      <Description>
        <FlexForm data-testid="signupForm" onSubmit={submit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <input
              id="email"
              data-testid="emailInput"
              onChange={(event) => updateEmail(event.target.value)}
            />
            <Label htmlFor="username">Username</Label>
            <input
              id="username"
              data-testid="usernameInput"
              style={
                usernameInput.includes(" ") ? { borderColor: "red" } : null
              }
              value={usernameInput}
              onChange={(event) => updateUsername(event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <input
              id="password"
              data-testid="passwordInput"
              type="password"
              value={passwordInput}
              onChange={(event) => updatePassword(event.target.value)}
              style={
                passwordInput &&
                passwordConfirm &&
                passwordInput !== passwordConfirm
                  ? { borderColor: "red" }
                  : null
              }
            />
            <Label htmlFor="confirm password">Confirm Password</Label>
            <input
              id="confirm password"
              data-testid="passwordConfirmInput"
              value={passwordConfirm}
              onChange={(e) => updateConfirm(e.target.value)}
              type="password"
              style={
                passwordInput &&
                passwordConfirm &&
                passwordInput !== passwordConfirm
                  ? { borderColor: "red" }
                  : null
              }
            />
          </div>
          <div>
            <ValidationMessages
              usernameInput={usernameInput}
              passwordInput={passwordInput}
              passwordConfirm={passwordConfirm}
            />
            <P>
              <SpanCbAligned>
                I agree to the <Tos /> and <Privacy />
                {"    "}
              </SpanCbAligned>
              <Checkbox
                id="tos"
                onClick={() => setTOS(!TOS)}
                data-testid="tosCheckbox"
              />
            </P>
            <div>
              <SubmitButton as="input" type="submit" value="Sign Up" />
            </div>
            <div>
              <Link to="/login">
                <Button>Already have an account? Login here!</Button>
              </Link>
            </div>
          </div>
        </FlexForm>
      </Description>
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
