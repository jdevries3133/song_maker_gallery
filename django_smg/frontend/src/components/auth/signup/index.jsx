import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { register, clearError } from "../../../actions/auth.action";
import styled, { P, Button, Checkbox, Description } from "../../common/styles";
import { ErrorArray } from "../../common/custom_error";
import { Tos, Privacy } from "../../legal";

// subtle adjust to align text with checkbox
const SpanCbAligned = styled.span`
  position: relative;
  bottom: 8px;
`;

const Header = styled.h1`
  margin: 0rem;
  font-size: 60px;
`;

const Grid = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 3rem;
`;

const LenMet = styled(P)`
  color: green;
  text-align: center;
`;

const Submit = styled(Button)`
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
          onOk={() => setBlanket(null)}
        />
      );
    } else if (passwordInput !== passwordConfirm) {
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
    const errors = Object.keys(props.authError).map(
      (k) => `${k}: ${props.authError[k]}`
    );
    setBlanket(
      <ErrorArray
        onOk={() => {
          props.clearError();
          setBlanket(null);
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
        <Grid>
          <div>
            <h3>Email</h3>
            <input
              data-testid="emailInput"
              onChange={(event) => updateEmail(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submit();
                }
              }}
            />
            <h3>Username</h3>
            <input
              data-testid="usernameInput"
              style={noSpace ? { borderColor: "red" } : null}
              value={usernameInput}
              onChange={(event) => updateUsername(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submit();
                }
              }}
            />
          </div>
          <div>
            <h3>Password</h3>
            <input
              data-testid="passwordInput"
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
              data-testid="passwordConfirmInput"
              value={passwordConfirm}
              onChange={(e) => updateConfirm(e.target.value)}
              type="password"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submit();
                }
              }}
            />
          </div>
          <div>
            {noSpace ? (
              <P center warn>
                Username may not contain spaces.
              </P>
            ) : null}
            {pass_bool ? (
              <LenMet>Your password is at least eight characters long</LenMet>
            ) : (
              <P center>Your password must be at least eight characters long</P>
            )}
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
              <Submit data-testid="submit" onClick={() => submit()}>
                Sign Up
              </Submit>
            </div>
            <div>
              <Link to="/login">
                <Button>Already have an account? Login here!</Button>
              </Link>
            </div>
          </div>
        </Grid>
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
