import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { register, clearError } from "Actions/auth.action";
import styled, {
  Div,
  Input,
  P,
  H2,
  Button,
  Label,
  Checkbox,
  Description,
} from "Styles";
import { Tos, Privacy } from "../../legal";

import { ValidationMessages } from "./validation_messages";

import { useModals } from "Common/useModals";

export const PASSWD_MIN_LENGTH = 9;

const Wrapper = styled.div`
  width: 100%;
  text-align: center;
`;

const Container = styled(Description)`
  max-width: 800px;
`;

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
  margin-bottom: 1.5rem;
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
  const [TOS, setTOS] = useState(false);

  const modalTypes = {
    BLANK_FIELDS: "BLANK FIELDS",
    PASSWORD_MISMATCH: "PASSWORD MISMATCH",
    TOS_UNCHECKED: "TOS_UNCHECKED",
    VALIDATION_ERROR: "VALIDATION_ERROR",
  };
  const [modals, dispatchModal] = useModals({
    props,
    modals: [
      {
        name: modalTypes.BLANK_FIELDS,
        show: () => (
          <>
            <H2>Blank Fields</H2>
            <p>Required fields are blank</p>
            <p>All fields are required.</p>
          </>
        ),
      },
      {
        name: modalTypes.PASSWORD_MISMATCH,
        show: () => (
          <H2 data-testid="passwordMismatchModal">Passwords do not match</H2>
        ),
      },
      {
        name: modalTypes.TOS_UNCHECKED,
        show: () => (
          <>
            <H2 data-testid="tosModalHeader">Terms of Service</H2>
            <p>You must accept the terms of service to make an account</p>
          </>
        ),
      },
      {
        name: modalTypes.VALIDATION_ERROR,
        show: ({ errors }) => {
          return (
            <>
              <H2>Validation Error</H2>
              {errors.map((e, i) => (
                <p key={e + i}>{e}</p>
              ))}
            </>
          );
        },
        onDismissed: () => props.clearError(),
      },
    ],
  });

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
      dispatchModal(modalTypes.BLANK_FIELDS);
      return false;
    } else if (passwordInput !== passwordConfirm) {
      dispatchModal(modalTypes.PASSWORD_MISMATCH);
      return false;
    } else if (!TOS) {
      dispatchModal(modalTypes.TOS_UNCHECKED);
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
  } else if (props.authError) {
    const errors = Object.keys(props.authError).map(
      (k) => `${k}: ${props.authError[k]}`
    );
    dispatchModal(modalTypes.VALIDATION_ERROR, { errors });
  }

  return (
    <Wrapper>
      {modals}
      <Header>sign up!</Header>
      <Container>
        <FlexForm data-testid="signupForm" onSubmit={submit}>
          <Div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              autoComplete="email"
              data-testid="emailInput"
              onChange={(event) => updateEmail(event.target.value)}
            />
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              autoComplete="username"
              data-testid="usernameInput"
              style={
                usernameInput.includes(" ") ? { borderColor: "red" } : null
              }
              value={usernameInput}
              onChange={(event) => updateUsername(event.target.value)}
            />
          </Div>
          <Div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              autoComplete="new-password"
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
            <Input
              id="confirm password"
              autoComplete="new-password"
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
          </Div>
          <Div>
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
            <Div>
              <SubmitButton as="input" type="submit" value="Sign Up" />
            </Div>
            <Div>
              <Link to="/login">
                <Button>Already have an account? Login here!</Button>
              </Link>
            </Div>
          </Div>
        </FlexForm>
      </Container>
    </Wrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    isAuthenticated: state.auth.isAuthenticated,
  };
};

export default connect(mapStateToProps, { register, clearError })(signup);
