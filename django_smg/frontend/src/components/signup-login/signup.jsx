import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { register, clearError } from "../../actions/auth.action";
import styled, { P, Button, Checkbox, Description } from "../generics/styles";

import { ErrorArray } from "../generics/custom_error";
import { Tos, Privacy } from "../legal";
import { BackendRegistrationError } from "./backend_registration_error";

const Header = styled.h1`
  margin: 0rem;
  font-size: 60px;
`;

const SignupModule = styled.div`
  text-align: center;
  padding: 3rem;
`;

const LenMet = styled(P)`
  color: green;
  text-align: center;
`;

const Signup = styled(Button)`
  font-size: 24px;
  height: auto;
  line-height: 40px;
  padding: 10px 5px 10px 5px;
  background-color: lightseagreen;
`;

/**
 * TODO: finish tests, then refactor by breaking up.
 */
const signup = (props) => {
  const [emailInput, updateEmail] = useState("");
  const [usernameInput, updateUsername] = useState("");
  const [passwordInput, updatePassword] = useState("");
  const [passwordConfirm, updateConfirm] = useState("");
  const [noSpace, setNoSpace] = useState(false);
  const [blanket, setBlanket] = useState(null);
  const [TOS, setTOS] = useState(false);

  useEffect(() => {
    document.title = props.title;
  }, []);

  if (usernameInput.includes(" ") && !noSpace) {
    setNoSpace(true);
  } else if (!usernameInput.includes(" ") && noSpace) {
    setNoSpace(false);
  }

  const submit = () => {
    if (passwordInput !== passwordConfirm) {
      setBlanket(
        <ErrorArray
          header="Passwords do not match"
          message={[""]}
          onOk={() => setBlanket(null)}
        />
      );
    } else if (!TOS) {
      setBlanket(
        <ErrorArray
          header="Terms of Service"
          message={["You must accept the terms of service to make an account"]}
          onOk={() => setBlanket(null)}
        />
      );
    } else if (
      emailInput === "" ||
      usernameInput === "" ||
      passwordInput === "" ||
      passwordConfirm === ""
    ) {
      setBlanket(
        <ErrorArray
          header="Blank Fields"
          message={["Required fields are blank", "All fields are required."]}
          onOk={() => setBlanket(null)}
        />
      );
    } else {
      props.register({
        email: emailInput,
        username: usernameInput,
        password: passwordInput,
      });
    }
  };

  let pass_bool = passwordInput.length >= 8;

  if (props.isAuthenticated) {
    return <Redirect to="/teacher" />;
  } else if (props.authError && !blanket) {
    setBlanket(
      <BackendRegistrationError
        onClose={() => {
          props.clearError();
          setBlanket(null);
        }}
        errors={props.authError}
      />
    );
  }
  return (
    <div>
      {blanket}
      <Header>sign up!</Header>
      <Description>
        <SignupModule>
          <h3>Email</h3>
          <input
            onChange={(event) => updateEmail(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submit();
              }
            }}
          />
          <h3>Username</h3>
          <input
            style={noSpace ? { borderColor: "red" } : null}
            value={usernameInput}
            onChange={(event) => updateUsername(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submit();
              }
            }}
          />
        </SignupModule>
        <SignupModule>
          <h3>Password</h3>
          <input
            type="password"
            value={passwordInput}
            onChange={(event) => updatePassword(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submit();
              }
            }}
          />
          <h3>Confirm Password</h3>
          <input
            value={passwordConfirm}
            onChange={(e) => updateConfirm(e.target.value)}
            type="password"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submit();
              }
            }}
          />
        </SignupModule>
        {noSpace ? (
          <p style={{ textAlign: "center", color: "red" }}>
            Username may not contain spaces.
          </p>
        ) : null}
        {pass_bool ? (
          <LenMet>Your password is at least eight characters long</LenMet>
        ) : (
          <P center>Your password must be at least eight characters long</P>
        )}
        {/* <label for="tos"> */}
        <span style={{ position: "relative", bottom: "8px" }}>
          I agree to the <Tos /> and <Privacy />
        </span>
        <Checkbox id="tos" onClick={() => setTOS(!TOS)}></Checkbox>
        <Signup onClick={() => submit()}>Sign Up</Signup>
        <Link to="/login">
          <Button>Already have an account? Login here!</Button>
        </Link>
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
